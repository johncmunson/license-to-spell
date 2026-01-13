import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { GithubIcon, XIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

const geistSans = localFont({
  variable: "--font-geist-sans",
  src: "../public/fonts/Geist[wght].ttf",
})

const geistMono = localFont({
  variable: "--font-geist-mono",
  src: "../public/fonts/GeistMono[wght].ttf",
})

const title = "License To Spell"
const description =
  "A fun word puzzle game where you spell words using the letters on randomly generated license plates. Test your vocabulary and see how many words you can find!"

const images = [
  {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: "License To Spell",
  },
]

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL!),
  title,
  description,
  openGraph: {
    title,
    description,
    images,
    type: "website",
    locale: "en_US",
    siteName: title,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images,
  },
}

const Footer = ({ className }: { className?: string }) => {
  return (
    <footer
      className={cn(
        `flex flex-col items-center text-sm text-slate-500 mt-16 sm:mt-20 ${className}`,
      )}
    >
      Made with ❤️ by John Munson
      <div className="flex mt-3 gap-4">
        <a
          href="https://github.com/johncmunson/license-to-spell"
          className="flex items-center hover:text-slate-700 transition-colors"
        >
          <GithubIcon className="w-4 h-4" />
          &nbsp;GitHub
        </a>
        <a
          href="https://twitter.com/yourusername"
          className="flex items-center hover:text-slate-700 transition-colors"
        >
          <XIcon className="w-4 h-4" />
          &nbsp;Twitter
        </a>
      </div>
    </footer>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-[310px] min-h-screen px-4 py-6 sm:px-8 sm:py-10 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200`}
      >
        <div className="font-mono">{children}</div>
        <Footer className="font-mono" />
      </body>
    </html>
  )
}
