import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Al-Huda",
  description: "A calm and guided daily Quran journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}