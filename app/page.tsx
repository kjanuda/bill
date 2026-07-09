"use client";

import { useState } from "react";

export default function Home() {
  const [accountNo, setAccountNo] = useState("");
  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkBill() {
    if (!accountNo.trim()) {
      setError("Enter your account number");
      return;
    }
    setError("");
    setLoading(true);
    setBill(null);

    try {
      const res = await fetch("/api/ceb-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_no: accountNo }),
      });
      const json = await res.json();

      if (json.ok) {
        setBill(json.data);
      } else {
        setError("Couldn't find a bill for that account number");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white flex items-start justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
          BILL PAY
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Check your CEB electricity bill
        </p>

        <label className="block mt-8 text-sm text-neutral-700">
          Please enter your Account Number
        </label>
        <input
          className="mt-2 w-full rounded-md border border-neutral-300 px-4 py-3 text-neutral-900 placeholder-neutral-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
          placeholder="CEB Account Number"
          value={accountNo}
          onChange={(e) => setAccountNo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && checkBill()}
        />

        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}

        <button
          onClick={checkBill}
          disabled={loading}
          className="mt-4 rounded-md bg-[#5c1414] hover:bg-[#4a1010] active:scale-[0.98] text-white font-medium px-6 py-3 transition disabled:opacity-60"
        >
          {loading ? "Checking..." : "Proceed"}
        </button>

        {bill && (
          <div className="mt-8 rounded-lg border border-neutral-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">Account holder</span>
              <span className="font-medium text-neutral-900">{bill.accountHolder}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">Account number</span>
              <span className="font-medium text-neutral-900">{bill.accountNumber}</span>
            </div>
            <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
              <span className="text-sm text-neutral-500">Bill balance</span>
              <span className="text-xl font-bold text-[#5c1414]">
                LKR {bill.billBalance}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">Registered mobile</span>
              <span className="font-medium text-neutral-900">{bill.registeredMobile}</span>
            </div>
          </div>
        )}

        <div className="mt-10 border-t border-neutral-100 pt-5">
          
        </div>
      </div>
    </main>
  );
}