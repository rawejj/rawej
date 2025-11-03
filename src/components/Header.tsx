import Image from "next/image";
import React from "react";

const Header: React.FC = () => (
  <header className="w-full py-6 px-4 flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 shadow-md sticky top-0 z-10">
    <h1 className="text-2xl font-bold text-purple-700 dark:text-pink-400 tracking-tight">Find Your Doctor</h1>
    <Image src="/favicon.ico" alt="Logo" width={32} height={32} />
  </header>
);

export default Header;
