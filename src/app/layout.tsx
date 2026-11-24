import { Work_Sans } from "next/font/google"
import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

const studioFont = Work_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  icons: { icon: "/brand-mark.svg" },
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className={studioFont.className}>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
