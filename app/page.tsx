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
    <>
      {/* Navbar */}
      <header className="w-full bg-[#5c1414]">
        <div className="max-w-6xl mx-auto flex items-center gap-4 px-6 py-3">
          <img
            src="https://payment.ceb.lk/public/img/mainlogo5.png"
            alt="Ceylon Electricity Board Logo"
            className="h-14 w-auto object-contain"
          />
        </div>
      </header>

      <main className="min-h-screen bg-white flex items-start justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
            BILL VIEW
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

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

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
                <span className="text-xl font-bold text-[#5c1414]">LKR {bill.billBalance}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Registered mobile</span>
                <span className="font-medium text-neutral-900">{bill.registeredMobile}</span>
              </div>
            </div>
          )}

          {/* Important Notice */}
          <div className="mt-10 rounded-lg border border-red-100 bg-red-50/40 p-5">
            <h2 className="text-lg font-extrabold text-red-500 tracking-tight">
              IMPORTANT NOTICE
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700 list-disc list-inside">
              <li>
                This service allows you to check your CEB electricity bill
                balance using your account number.
              </li>
              <li>
                Bill details shown may take some time to update after a
                payment is made — figures may not reflect very recent
                transactions immediately.
              </li>
              <li>
                Ensure you enter the correct account number to view accurate
                bill information.
              </li>
              <li>
                If your account number is not found or the details shown seem
                incorrect, please contact our call center or your respective
                Area Office for clarification.
              </li>
              <li>
                For your convenience, you may send a copy of your bill details
                to your registered email address.
              </li>
            </ul>
          </div>

          <div className="mt-10 border-t border-neutral-100 pt-5 text-center">
            <p className="text-xs text-neutral-400">
              Developed by <a href="https://kjanuda.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-[#5c1414] font-medium transition">Januda J Kodithuwakku</a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}