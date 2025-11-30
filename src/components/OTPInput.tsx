import React, { useRef, useMemo, forwardRef } from "react";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  className?: string;
}

const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(({ value, onChange, length = 4, className = "" }, ref) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(length).fill(null));

  const otp = useMemo(() => {
    const newOtp = value.split("").slice(0, length);
    while (newOtp.length < length) newOtp.push("");
    return newOtp;
  }, [value, length]);

  const handleChange = (index: number, inputValue: string) => {
    const digits = inputValue.replace(/\D/g, "").slice(0, length - index);
    if (digits.length === 0 && inputValue !== "") return; // Invalid input

    const newOtp = [...otp];
    for (let i = 0; i < digits.length; i++) {
      newOtp[index + i] = digits[i];
    }
    onChange(newOtp.join(""));

    // Auto-focus next input
    const nextIndex = index + digits.length;
    if (nextIndex < length) {
      setTimeout(() => inputRefs.current[nextIndex]?.focus(), 0);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault(); // Prevent default backspace behavior
      const newOtp = [...otp];
      if (otp[index]) {
        // Clear current digit and move left
        newOtp[index] = "";
        onChange(newOtp.join(""));
        if (index > 0) {
          setTimeout(() => inputRefs.current[index - 1]?.focus(), 0);
        }
      } else if (index > 0) {
        // Move to previous input if current is empty
        setTimeout(() => inputRefs.current[index - 1]?.focus(), 0);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const newOtp = paste.split("").concat(Array(length - paste.length).fill(""));
    onChange(newOtp.join(""));
  };

  return (
    <div className={`flex gap-2 justify-center ${className}`} dir="ltr">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { 
            inputRefs.current[index] = el; 
            if (index === 0 && ref) {
              (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
            }
          }}
          type="text"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-xl font-bold border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          dir="ltr"
          required
        />
      ))}
    </div>
  );
});

OTPInput.displayName = "OTPInput";

export default OTPInput;