"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider, useLanguage } from "@/contexts/language-context";

const inter = Inter({ subsets: ["latin"] });

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();

  return (
    <html lang={language}>
      <head>
        <title>AutoRemind - Easy Reminders for busy people</title>
        <meta name="description" content="Easy Reminders for busy people." />
        <meta
          name="keywords"
          content="automatic reminders, easy reminders, easy, busy people, automatic, reminders, auto garage, SMS reminders, lembretes manutenção, oficina auto"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <RootLayoutContent>{children}</RootLayoutContent>
    </LanguageProvider>
  );
}
