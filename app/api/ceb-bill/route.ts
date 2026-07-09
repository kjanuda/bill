import { chromium } from "playwright";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { account_no } = await req.json();

    if (!account_no) {
      return NextResponse.json(
        {
          ok: false,
          error: "Account number required",
        },
        { status: 400 }
      );
    }


    const browser = await chromium.launch({
      headless: true,
    });


    const page = await browser.newPage();


    await page.goto(
      "https://payment.ceb.lk/index.php/instantpay",
      {
        waitUntil: "networkidle",
      }
    );


    await page.fill("#account_no", account_no);

    await page.click("#btnSubmit");


    await page.waitForLoadState("networkidle")
      .catch(() => {});


    const bodyText = await page.locator("body").innerText();


    await browser.close();



    const extract = (label: string) => {
      const regex = new RegExp(
        `${label}:\\s*(.*?)\\s*(?=Account holder|Account Number|Bill Date|Bill Balance|Registered Mobile|Payment Information|$)`,
        "i"
      );

      const match = bodyText.match(regex);

      return match ? match[1].trim() : "-";
    };


    const data = {
      accountHolder: extract("Account holder's name"),
      accountNumber: extract("Account Number"),
      billBalance: extract("Bill Balance"),
      registeredMobile: extract("Registered Mobile Number"),
    };


    return NextResponse.json({
      ok:true,
      data,
    });



  } catch(error:any){

    console.error(error);

    return NextResponse.json(
      {
        ok:false,
        error:error.message,
      },
      {
        status:500,
      }
    );
  }
}