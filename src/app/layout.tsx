import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeClientProvider from "@/providers/ThemeClientProvider";
import { LocalizationClientProvider } from "@/providers/LocalizationClientProvider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doctor Appointment System",
  description: "Book appointments with qualified doctors online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const stored = localStorage.getItem('theme');
                const theme = stored || 'system';
                const resolved = theme === 'system' ? getSystemTheme() : theme;
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(resolved);
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocalizationClientProvider>
          <ThemeClientProvider>
            {children}
          </ThemeClientProvider>
        </LocalizationClientProvider>
      </body>
    </html>
  );
}
