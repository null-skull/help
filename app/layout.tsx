import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Helpperr — Professional Documentation, Built in Minutes",
    template: "%s — Helpperr",
  },
  description:
    "Record any workflow with our Chrome extension. Helpperr's AI instantly transforms it into polished, searchable, reusable documentation - no writing required.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable} antialiased`}>
      <body>
        <SmoothScroll>
          {/* Theme wrapper for every page. Site chrome (nav, footer, Book a
              Demo modal) lives in app/(site)/layout.tsx, so the auth pages in
              app/(auth) render without it. */}
          <div className="home-new min-h-screen bg-page font-display text-fg">{children}</div>
        </SmoothScroll>
      </body>
    </html>
  );
}
