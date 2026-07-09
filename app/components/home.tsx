"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Loader2, AlertCircle, User, Hash, Wallet, Phone } from "lucide-react";

type BillData = {
  accountHolder: string;
  accountNumber: string;
  billBalance: string;
  registeredMobile: string;
};

export default function CebBillCheckerPage() {
  const [accountNo, setAccountNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bill, setBill] = useState<BillData | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBill(null);

    if (!accountNo.trim()) {
      setError("Please enter your CEB account number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ceb-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_no: accountNo.trim() }),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setError(json.error ?? "Could not fetch bill details.");
        return;
      }
      setBill(json.data);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-zinc-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
            <Zap className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">CEB Bill Checker</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Enter your account number to preview your latest bill
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm"
        >
          <label htmlFor="accountNo" className="block text-xs font-medium text-zinc-400 mb-2">
            CEB Account Number
          </label>
          <div className="flex gap-2">
            <input
              id="accountNo"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 2504629109"
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value.replace(/[^\d]/g, ""))}
              maxLength={15}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 transition-colors placeholder:text-zinc-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-semibold text-sm rounded-xl px-5 py-3 transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check"}
            </button>
          </div>
        </motion.form>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-xl px-4 py-3"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {bill && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="mt-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/80">
                <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
                  Bill Preview
                </span>
              </div>

              <div className="divide-y divide-zinc-800/80">
                <Row icon={<User className="w-4 h-4" />} label="Account Holder" value={bill.accountHolder} />
                <Row icon={<Hash className="w-4 h-4" />} label="Account Number" value={bill.accountNumber} />
                <Row
                  icon={<Wallet className="w-4 h-4" />}
                  label="Bill Balance"
                  value={`LKR ${Number(bill.billBalance).toLocaleString("en-LK", {
                    minimumFractionDigits: 2,
                  })}`}
                  highlight
                />
                <Row icon={<Phone className="w-4 h-4" />} label="Registered Mobile" value={bill.registeredMobile} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Data is fetched live from CEB&apos;s payment portal. This tool only previews details — it doesn&apos;t process payments.
        </p>
      </div>
    </main>
  );
}

function Row({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div className="flex items-center gap-2 text-zinc-500 text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <span className={`text-sm font-medium ${highlight ? "text-amber-400" : "text-zinc-100"}`}>
        {value}
      </span>
    </div>
  );
}
