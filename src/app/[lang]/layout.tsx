import { languages, LanguageKey } from "@/providers/LocalizationProvider";
import { DEFAULT_LANGUAGE } from "@/lib/constants";
import { ReactNode } from "react";
import { loadTranslations } from "@/lib/translations";
import { TranslationsProvider } from "@/providers/TranslationsProvider";
import Header from "@/components/Header";

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  const lang = ((await params).lang || DEFAULT_LANGUAGE) as LanguageKey;
  const config = languages[lang] || languages[DEFAULT_LANGUAGE];
  
  // Load translations for this language
  const translations = await loadTranslations(lang);

  return (
    <div lang={lang} dir={config.direction}>
        <TranslationsProvider translations={translations}>
            <Header />
            {children}
        </TranslationsProvider>
    </div>
  );
}
