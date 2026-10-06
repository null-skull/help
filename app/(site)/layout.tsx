import Nav from "@/components/home-new/Nav";
import Footer from "@/components/home-new/Footer";
import BookDemoModal from "@/components/home-new/BookDemoModal";

// Marketing pages (home, pricing, contact): the nav, footer and the Book a
// Demo modal (opened from anywhere via openBookDemo()).
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
      <BookDemoModal />
    </>
  );
}
