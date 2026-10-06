import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageTransition from "@/components/home-new/PageTransition";
import AuthFlow from "@/components/home-new/auth/AuthFlow";
import AuthShowcase from "@/components/home-new/auth/AuthShowcase";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in or create your Helpperr account with a magic link or Google.",
  robots: { index: false },
};

// Standalone auth screen — no site nav or footer (see app/(site)/layout.tsx).
// Split layout: the form on the left, the platform showcase panel on the
// right (desktop only; phones and tablets get the form alone).
export default function LoginPage() {
  return (
    <main className="tone-cyan grid min-h-svh bg-page lg:grid-cols-2">
      <div className="flex flex-col px-gutter py-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft size={16} aria-hidden />
          Back to home
        </Link>

        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[25rem]">
            <PageTransition>
              <div className="flex flex-col items-center gap-6">
                <Link
                  href="/"
                  aria-label="Helpperr home"
                  className="rounded-xl transition-transform hover:scale-105"
                >
                  <Image src="/home-new/icons/Layer_1-1.svg" alt="" width={188} height={188} priority className="size-12" />
                </Link>
                <div className="w-full">
                  <AuthFlow />
                </div>
              </div>
            </PageTransition>
          </div>
        </div>
      </div>

      <div className="hidden p-3 lg:block">
        <AuthShowcase />
      </div>
    </main>
  );
}
