import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalWrapper from "@/components/layout/ConditionalWrapper";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "Health Line Review | Expert Health Information & Reviews",
  description: "Your trusted source for health articles, product reviews, and wellness tips.",
  keywords: ["health", "wellness", "nutrition", "reviews", "medical advice"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`} suppressHydrationWarning>
        <ConditionalWrapper>
          {children}
        </ConditionalWrapper>
      </body>
    </html>
  );
}
