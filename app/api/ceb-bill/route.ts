import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

const CEB_INSTANT_PAY_URL = "https://payment.ceb.lk/index.php/instantpay";
const REQUEST_TIMEOUT_MS = 15_000;

type BillData = {
  accountHolder: string;
  accountNumber: string;
  billBalance: string;
  registeredMobile: string;
};

export async function POST(req: Request) {
  try {
    const { account_no } = (await req.json()) as { account_no?: unknown };
    const accountNo = typeof account_no === "string" ? account_no.trim() : "";

    if (!/^\d{1,10}$/.test(accountNo)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Enter a valid CEB account number.",
        },
        { status: 400 },
      );
    }

    const html = await submitAccountNumber(accountNo);
    const data = extractBillData(html);

    if (!hasBillData(data)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Could not find bill details for that account number.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      data,
    });
  } catch (error: unknown) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not fetch bill details right now.",
      },
      { status: 502 },
    );
  }
}

async function submitAccountNumber(accountNo: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const initialResponse = await fetch(CEB_INSTANT_PAY_URL, {
      headers: {
        "User-Agent": userAgent(),
      },
      signal: controller.signal,
    });
    const cookie = initialResponse.headers.get("set-cookie");

    const body = new URLSearchParams({ account_no: accountNo });
    const billResponse = await fetch(CEB_INSTANT_PAY_URL, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": userAgent(),
        ...(cookie ? { Cookie: cookie } : {}),
      },
      redirect: "follow",
      signal: controller.signal,
    });

    if (!billResponse.ok) {
      throw new Error("CEB payment portal returned an error.");
    }

    return billResponse.text();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("CEB payment portal timed out.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function extractBillData(html: string): BillData {
  const $ = cheerio.load(html);
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();

  return {
    accountHolder: extract(bodyText, "Account holder's name"),
    accountNumber: extract(bodyText, "Account Number"),
    billBalance: extract(bodyText, "Bill Balance"),
    registeredMobile: extract(bodyText, "Registered Mobile Number"),
  };
}

function extract(bodyText: string, label: string) {
  const labels =
    "Account holder|Account holder's name|Account Number|Bill Date|Bill Balance|Registered Mobile|Registered Mobile Number|Payment Information";
  const regex = new RegExp(`${label}:?\\s*(.*?)\\s*(?=${labels}|$)`, "i");
  const match = bodyText.match(regex);

  return match?.[1]?.trim() ?? "";
}

function hasBillData(data: BillData) {
  return Boolean(data.accountNumber || data.accountHolder || data.billBalance);
}

function userAgent() {
  return "Mozilla/5.0 (compatible; BillPreview/1.0; +https://www.netlify.com/)";
}
