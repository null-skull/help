import type { Metadata } from "next";
import { PRIVACY_POLICY } from "@/lib/legal-content";
import PageTransition from "@/components/home-new/PageTransition";
import HashScroll from "@/components/home-new/HashScroll";
import LegalDocument from "@/components/home-new/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Helpperr collects, uses and protects your data across the Chrome Extension and web platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <PageTransition>
      {/* Lands on a section when linked as e.g. /privacy-policy#security. */}
      <HashScroll />
      <LegalDocument doc={PRIVACY_POLICY} />
    </PageTransition>
  );
}
