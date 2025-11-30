import React, { useState } from "react";
import Modal from "../Modal";
import { useTranslations } from "@/providers/TranslationsProvider";
import { useLocalization } from "@/providers/useLocalization";

interface SignInModalProps {
  show: boolean;
  onClose: () => void;
}

export default function SignInModal({ show, onClose }: SignInModalProps) {
  const { t } = useTranslations();
  const { config } = useLocalization();
  const isRtl = config.direction === "rtl";
  const [countryCode, setCountryCode] = useState("+98");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const COUNTRY_CODES = [
    { code: "+1", flag: "🇺🇸" },
    { code: "+964", flag: "🇮🇶" },
    { code: "+98", flag: "🇮🇷" },
    { code: "+44", flag: "🇬🇧" },
    { code: "+49", flag: "🇩🇪" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Normalize mobile number: remove leading zero if present
    let number = mobileNumber.trim();
    if (number.startsWith("0")) {
      number = number.substring(1);
    }
    const fullNumber = `${countryCode}${number}`;

    // Mock API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO: Implement actual sign-in logic here
      console.log("Signing in with:", fullNumber);
      onClose();
    } catch (err) {
      setError(t("auth.failed to sign in", "Failed to sign in. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onClose={onClose} type="info">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          {t("auth.sign in", "Sign In")}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="mobileNumber"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              {t("auth.mobile number", "Mobile Number")}
            </label>
            <div className="flex gap-2" dir="ltr">
              <div className="relative">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="appearance-none h-full pl-3 pr-8 py-2 border border-slate-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white bg-white text-base"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
              <input
                type="tel"
                id="mobileNumber"
                value={mobileNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setMobileNumber(val);
                }}
                className={`flex-1 px-3 py-2 border border-slate-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white ${isRtl ? "text-right" : "text-left"}`}
                placeholder={t("auth.enter mobile number", "Enter your mobile number")}
                required
                dir="auto"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 text-start">
              e.g. 0990... or 990...
            </p>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              t("auth.submit", "Sign In")
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
}
