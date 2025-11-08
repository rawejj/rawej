"use client";

import React from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";

const Header: React.FC = () => (
  <header className="w-full py-6 px-4 flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 shadow-md sticky top-0 z-10">
    <h1 className="text-2xl font-bold text-purple-700 dark:text-pink-400 tracking-tight">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <LanguageSwitcher />
      <ThemeSwitcher />
    </div>
  </header>
);

export default Header;
