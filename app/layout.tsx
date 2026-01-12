import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GithubIcon, XIcon } from "@/components/icons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "License To Spell",
  description: "A fun license plate-themed word game",
};

const Footer = () => {
  return (
    <footer className="flex flex-col items-center text-sm mt-12">
      Made with ❤️ by John Munson
      <div className="flex mt-2 gap-3">
        <a href="https://github.com/johncmunson/license-to-spell" className="flex">
          <GithubIcon className="w-4 h-4" />&nbsp;GitHub
        </a>
        <a href="https://twitter.com/yourusername" className="flex">
          <XIcon className="w-4 h-4" />&nbsp;Twitter
        </a>
      </div>
    </footer>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-[310px] min-h-screen px-3 py-4 sm:p-8 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
