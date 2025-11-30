"use client";

import React, { useState } from "react";
import { useLocalization } from "@/providers/useLocalization";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import UserAvatar from "./UserAvatar";
import SignInModal from "./SignInModal";

const Header: React.FC = () => {
  const { config } = useLocalization();
  const isRtl = config.direction === "rtl";
  const [showSignIn, setShowSignIn] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

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
          <LanguageSwitcher />
          <ThemeSwitcher />
          <UserAvatar onSignIn={() => setShowSignIn(true)} refetchTrigger={refetchTrigger} />
        </div>
      </header>
      <SignInModal show={showSignIn} onClose={() => setShowSignIn(false)} onSuccess={() => setRefetchTrigger(prev => prev + 1)} />
    </>
  );
};

export default Header;
