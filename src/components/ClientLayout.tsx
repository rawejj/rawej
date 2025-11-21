"use client";

import { ReactNode } from "react";
import { CookieConsentProvider } from "@/providers/CookieConsentProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleSearchConsole from "@/components/GoogleSearchConsole";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <CookieConsentProvider>
      {children}
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
      {process.env.NEXT_PUBLIC_GSC_VERIFICATION_CODE && (
        <GoogleSearchConsole verificationCode={process.env.NEXT_PUBLIC_GSC_VERIFICATION_CODE} />
      )}
    </CookieConsentProvider>
  );
}