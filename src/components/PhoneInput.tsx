import React from "react";
import { useTranslations } from "@/providers/TranslationsProvider";
import { useLocalization } from "@/providers/useLocalization";
import Dropdown from "./Dropdown";
import { COUNTRY_CODES } from "@/constants/countries";

interface PhoneInputProps {
  countryCode: string;
  mobileNumber: string;
  onCountryCodeChange: (code: string) => void;
  onMobileNumberChange: (number: string) => void;
  label?: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
}

export default function PhoneInput({
  countryCode,
  mobileNumber,
  onCountryCodeChange,
  onMobileNumberChange,
  label,
  placeholder,
  helpText,
  required = false,
}: PhoneInputProps) {
  const { t } = useTranslations();
  const { config } = useLocalization();
  const isRtl = config.direction === "rtl";

  const defaultLabel = t("auth.mobile number", "Mobile Number");
  const defaultPlaceholder = t("auth.enter mobile number", "Enter your mobile number");
  const defaultHelpText = t("auth.mobile help", "e.g. 9123456789");

  return (
    <div>
      <label
        htmlFor="mobileNumber"
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
      >
        {label || defaultLabel}
      </label>
      <div className="relative" dir="ltr">
        <div className="flex border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
          <Dropdown
            options={COUNTRY_CODES.map(c => ({ value: c.code, label: c.code, flag: c.flag }))}
            value={countryCode}
            onChange={onCountryCodeChange}
            searchable={false}
            dir="ltr"
            className="w-28 border-0 rounded-none bg-transparent"
          />
          <input
            type="tel"
            id="mobileNumber"
            value={mobileNumber}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, "");
              onMobileNumberChange(val);
            }}
            className={`flex-1 px-3 py-2 bg-transparent focus:outline-none dark:bg-transparent dark:text-white text-left ${isRtl ? "placeholder:text-right" : "placeholder:text-left"}`}
            placeholder={placeholder || defaultPlaceholder}
            required={required}
            dir="ltr"
          />
        </div>
      </div>
      {(helpText || defaultHelpText) && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 text-left">
          {helpText || defaultHelpText}
        </p>
      )}
    </div>
  );
}