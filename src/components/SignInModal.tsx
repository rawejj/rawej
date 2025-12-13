import React, { useState, useEffect, useRef, useCallback } from "react";
import Modal from "@/components/Modal";
import { useTranslations } from "@/providers/TranslationsProvider";
import { useLocalization } from "@/providers/useLocalization";
import PhoneInput from "@/components/PhoneInput";
import Button from "@/components/Button";
import OTPInput from "@/components/OTPInput";

interface SignInModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type SignInStep = "phone" | "otp";

export default function SignInModal({ show, onClose, onSuccess }: SignInModalProps) {
  const { t } = useTranslations();
  const { language } = useLocalization();
  const [step, setStep] = useState<SignInStep>("phone");
  const [countryCode, setCountryCode] = useState("+98");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpInputRef.current?.focus(), 0);
    }
  }, [step]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Normalize mobile number: remove leading zero if present
    let normalizedNumber = mobileNumber.trim();
    if (normalizedNumber.startsWith("0")) {
      normalizedNumber = normalizedNumber.substring(1);
    }

    try {
      const response = await fetch("/api/v1/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          to: normalizedNumber,
          countryCode,
          language
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep("otp");
        setError(null);
        setCountdown(120);
        setResendDisabled(true);
      } else {
        console.error("OTP send failed:", data.error);
        setError(t("auth.failed to send otp", "Failed to send OTP. Please try again."));
      }
    } catch (error) {
      console.error("OTP send network error:", error);
      setError(t("auth.failed to send otp", "Failed to send OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    // Normalize mobile number: remove leading zero if present
    let normalizedNumber = mobileNumber.trim();
    if (normalizedNumber.startsWith("0")) {
      normalizedNumber = normalizedNumber.substring(1);
    }

    try {
      const response = await fetch("/api/v1/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: normalizedNumber,
          code: otp.trim(),
          countryCode
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Success - call onSuccess if provided, then close modal and reset state
        onSuccess?.();
        onClose();
        resetModal();
      } else {
        setError(t("auth.invalid otp", "Invalid OTP. Please try again."));
      }
    } catch {
      setError(t("auth.failed to verify otp", "Failed to verify OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  }, [mobileNumber, otp, countryCode, t, onSuccess, onClose]);

  // Auto-verify OTP when complete
  useEffect(() => {
    if (otp.length === 5 && !loading && step === "otp") {
      handleVerifyOTP();
    }
  }, [otp, loading, step, handleVerifyOTP]);

  const resetModal = () => {
    setStep("phone");
    setMobileNumber("");
    setOtp("");
    setError(null);
    setCountdown(0);
    setResendDisabled(false);
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp("");
    setError(null);
  };

  return (
    <Modal show={show} onClose={handleClose} type="info">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">
          {t("auth.sign in", "Sign In")}
        </h2>

        {step === "phone" ? (
          <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
            <PhoneInput
              countryCode={countryCode}
              mobileNumber={mobileNumber}
              onCountryCodeChange={setCountryCode}
              onMobileNumberChange={setMobileNumber}
              required
            />

            {error && (
              <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              loadingText={t("buttons.sending", "Sending OTP...")}
              fullWidth
              variant="primary"
            >
              {t("auth.send otp", "Send OTP")}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
            <div className="text-center mb-2">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                {t("auth.enter otp", "Enter the 4-digit code sent to")}
              </p>
              <div className="flex justify-center gap-5 font-medium text-zinc-800 dark:text-zinc-200" dir="ltr">
                <div className="py-2">{countryCode}{mobileNumber.startsWith("0") ? mobileNumber.substring(1) : mobileNumber}</div>
                <Button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={resendDisabled || loading}
                  variant="secondary"
                  size="sm"
                  className="self-start"
                >
                  {resendDisabled ? `Resend in ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}` : t("auth.resend otp", "Resend OTP")}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <OTPInput
                ref={otpInputRef}
                value={otp}
                onChange={setOtp}
                length={5}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleBackToPhone}
                variant="secondary"
                className="flex-1"
                disabled={loading}
              >
                {t("buttons.back", "Back")}
              </Button>
              <Button
                type="submit"
                loading={loading}
                loadingText={t("buttons.verifying", "Verifying...")}
                fullWidth
                variant="primary"
                className="flex-1"
                disabled={otp.length === 5 || loading}
              >
                {otp.length === 5 ? t("buttons.verifying", "Verifying...") : t("auth.verify", "Verify")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
