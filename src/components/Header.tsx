"use client";

import React from "react";
import { useLocalization } from "@/providers/useLocalization";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";

const Header: React.FC = () => {
  const { config } = useLocalization();
  const isRtl = config.direction === "rtl";
  // const [showSignIn, setShowSignIn] = React.useState(false);

  return (
    <>
      <header
        className={`w-full py-6 px-4 flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 shadow-md sticky top-0 z-10 ${isRtl ? "flex-row-reverse" : "flex-row"}`}
        dir={config.direction}
      >
        <h1 className="text-2xl font-bold text-purple-700 dark:text-pink-400 tracking-tight">
          {process.env.NEXT_PUBLIC_APP_NAME}
        </h1>
        <div
          className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : "flex-row"}`}
        >
          {/* <button
            onClick={() => setShowSignIn(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            {t("auth.sign in", "Sign In")}
          </button> */}
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </header>
      {/* <SignInModal show={showSignIn} onClose={() => setShowSignIn(false)} /> */}
    </>
  );
};

export default Header;
