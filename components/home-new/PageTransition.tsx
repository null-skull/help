import { ViewTransition } from "react";

// Route transition for page content: the old page fades out quickly while the
// new one fades up into place (CSS in globals.css, `.page-exit` / `.page-enter`).
// Must wrap content in each page.tsx, not the layout — layouts persist across
// navigations, so enter/exit would never fire there. Browsers without the View
// Transitions API simply navigate without the animation.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {/* One wrapper element so the whole page animates as a single layer. */}
      <div>{children}</div>
    </ViewTransition>
  );
}
