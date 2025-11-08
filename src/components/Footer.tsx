import React from "react";

const Footer: React.FC = () => (
  <footer className="w-full py-4 text-center text-xs text-zinc-400 dark:text-zinc-500 bg-white/60 dark:bg-zinc-900/60 mt-8 rounded-t-2xl shadow-inner">
    &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME || 'Rawej'}
  </footer>
);

export default Footer;
