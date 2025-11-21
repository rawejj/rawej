"use client";

import { ReactNode } from "react";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleSearchConsole from "@/components/GoogleSearchConsole";
import { CONFIGS } from "@/constants/configs";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      {children}
      {CONFIGS.analytics.gaMeasurementId && (
        <GoogleAnalytics measurementId={CONFIGS.analytics.gaMeasurementId} />
      )}
      {CONFIGS.analytics.gscVerificationCode && (
        <GoogleSearchConsole verificationCode={CONFIGS.analytics.gscVerificationCode} />
      )}
    </>
  );
}