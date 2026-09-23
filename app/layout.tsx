import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/home-new/Nav";
import Footer from "@/components/home-new/Footer";
import BookDemoModal from "@/components/home-new/BookDemoModal";

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
          {/* Shared site chrome: every page gets the nav, footer and the
              Book a Demo modal (opened from anywhere via openBookDemo()). */}
          <div className="home-new min-h-screen bg-page font-display text-fg">
            <Nav />
            <main>{children}</main>
            <Footer />
            <BookDemoModal />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
