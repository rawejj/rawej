"use client";

import React from "react";
import { useLocalization } from "@/providers/useLocalization";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";

const Header: React.FC = () => {
  const { config } = useLocalization();
  const isRtl = config.direction === 'rtl';
  return (
    <header
      className={`w-full py-6 px-4 flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 shadow-md sticky top-0 z-10 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}
      dir={config.direction}
    >
      <h1 className="text-2xl font-bold text-purple-700 dark:text-pink-400 tracking-tight">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
      <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;
