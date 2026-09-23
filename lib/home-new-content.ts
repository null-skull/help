// Internal links: "/" and "/#section" point at the home page (smooth-scrolled
// when already on it), other paths are separate routes.
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Platform", href: "/#platform" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQs", href: "/#faq" },
];

export const ANNOUNCEMENT = {
  badge: "NEW",
  text: "Introducing Ask: Query your entire stack in plain language",
};

export const HERO = {
  heading: "Professional Documentation. Built in Minutes.",
  sub: "Record any workflow with our Chrome extension. Helpperr's AI instantly transforms it into polished, searchable, reusable documentation - no writing required.",
  primaryCta: "Book a Demo",
  secondaryCta: "Add to Chrome - it's Free",
  steps: [
    {
      number: "1.",
      label: "Connect",
      body: "Plug in your tools. 240+ integrations out of the box.",
    },
    {
      number: "2.",
      label: "Map",
      body: "Cortex automatically builds your knowledge graph.",
    },
    {
      number: "3.",
      label: "Ask",
      body: "Query in plain language. Share results with your team.",
    },
  ],
};

export const HERO2 = {
  heading: "See Helpperr in action",
  sub: "Watch a single recording turn into a polished, structured guide — annotated screenshots, written steps, and all — in minutes.",
  primaryCta: "Book a Demo",
  secondaryCta: "Add to Chrome - it's Free",
};

export const HOW_IT_WORKS = {
  badge: "WORKFLOW",
  heading: ["From screen recording to", "polished documentation."],
  description:
    "Helpperr continuously captures, analyzes, and transforms your workflows into structured documentation that keeps your team moving faster.",
  steps: [
    {
      number: "01",
      title: "Record",
      body: "Capture any workflow with our Chrome extension. No setup, no writing.",
    },
    {
      number: "02",
      title: "Analyze",
      body: "Helpperr's AI processes the recording and identifies every step.",
    },
    {
      number: "03",
      title: "Generate",
      body: "Structured, editable documentation is created automatically with screenshots.",
    },
    {
      number: "04",
      title: "Publish",
      body: "Export to PDF or Markdown, or embed anywhere your team already works.",
    },
  ],
};

export const FEATURE_HUB = {
  badge: "PLATFORM",
  heading: ["Everything documentation", "needs, built in."],
  description:
    "One workspace that connects recording, AI writing, editing, and publishing — so nothing falls through the cracks.",
  items: [
    { icon: "Sparkles", label: "AI-First Docs" },
    { icon: "Video", label: "Video + Docs" },
    { icon: "PenTool", label: "Visual Editor" },
    { icon: "BookOpen", label: "Knowledge Base" },
    { icon: "ShieldCheck", label: "Enterprise Ready" },
    { icon: "Repeat", label: "Reusable Content" },
    { icon: "TrendingUp", label: "Built to Scale" },
    { icon: "Users", label: "Team Workspaces" },
  ],
};

export const LOGO_MARQUEE = {
  label: "Trusted by 56+ teams who are tired of tab-switching",
  logos: [
    { name: "Ford", src: "/home-new/logos/ford.svg", width: 122 },
    { name: "Honda", src: "/home-new/logos/honda.svg", width: 48 },
    { name: "Lexus", src: "/home-new/logos/lexus.svg", width: 122 },
    { name: "Toyota", src: "/home-new/logos/toyota.svg", width: 246 },
    { name: "Chevrolet", src: "/home-new/logos/chevrolet.svg", width: 144 },
    { name: "GMC", src: "/home-new/logos/gmc.svg", width: 158 },
    { name: "Nissan", src: "/home-new/logos/nissan.svg", width: 48 },
  ],
};

// PLACEHOLDER: Figma source file has identical body copy across all 3 cards.
// Swap in real feature copy here when available.
export const FEATURES = {
  heading: {
    muted: "One product, every step covered — ",
    emphasis: "from recording to reusable documentation.",
  },
  // Drop a matching video file for each feature into public/home-new/videos/
  // (filenames below). Until a file exists, that step falls back to its
  // gradient placeholder — nothing breaks either way.
  items: [
    {
      title: "AI Documentation",
      body: "Turn any recording into structured, AI-written documentation automatically — no manual writing required.",
      video: "/home-new/videos/ai-documentation.mp4",
    },
    {
      title: "Guide Editor",
      body: "Fine-tune every guide in a powerful visual editor. Rearrange steps, edit text, and polish before you publish.",
      video: "/home-new/videos/guide-editor.mp4",
    },
    {
      title: "Screenshot Customization Studio",
      body: "Annotate, crop, blur, and brand every screenshot so it matches your product and your standards.",
      video: "/home-new/videos/screenshot-studio.mp4",
    },
    {
      title: "Capture Engine",
      body: "Record any workflow with our Chrome extension — clicks, inputs, and navigation captured automatically.",
      video: "/home-new/videos/capture-engine.mp4",
    },
    {
      title: "Knowledge Management",
      body: "Organize every guide into a searchable knowledge base your whole team can rely on.",
      video: "/home-new/videos/knowledge-management.mp4",
    },
    {
      title: "Workspace & Administration",
      body: "Manage teams, roles, and permissions from a single admin workspace built for scale.",
      video: "/home-new/videos/workspace-admin.mp4",
    },
    {
      title: "Share & Export",
      body: "Publish anywhere — export to PDF or Markdown, or embed directly into Notion, Confluence, and more.",
      video: "/home-new/videos/share-export.mp4",
    },
  ],
};

export const PRICING = {
  badge: "PRICING",
  heading: ["Simple, credit-based", "pricing."],
  description:
    "Every plan runs on AI credits. Use them however you work — pay for what your team actually generates.",
  plans: [
    {
      name: "Free",
      price: "$0",
      period: "14-day trial",
      credits: "100 credits",
      creditsNote: "or until your trial credits run out, whichever comes first",
      description: "Try Helpperr with no credit card required.",
      cta: "Start Free",
      features: [
        "100 AI credits total (trial)",
        "Up to 30 credits per generation",
        "1 user, 1 personal workspace",
        "View & share guides after trial ends",
      ],
      highlight: false,
    },
    {
      name: "Pro",
      price: "$15",
      period: "/ month",
      credits: "700 credits",
      creditsNote: "refreshed every month",
      description: "For individuals documenting solo.",
      cta: "Get Pro",
      features: [
        "700 AI credits per month",
        "1 user, 1 personal workspace",
        "Billed to your user account",
        "Top up credits anytime",
      ],
      highlight: true,
    },
    {
      name: "Team",
      price: "$25",
      period: "/ seat / month",
      credits: "1,200 credits",
      creditsNote: "per seat, pooled for the whole team",
      description: "For teams who share the documentation workload.",
      cta: "Get Team",
      features: [
        "1,200 AI credits per seat",
        "Minimum 2 seats",
        "Shared workspace credit pool",
        "Billed to the workspace",
      ],
      highlight: false,
      seats: { min: 2, max: 15, default: 5 },
    },
  ],
  topUps: {
    heading: "Need more credits?",
    description:
      "Top up anytime once your monthly credits run out. Purchased credits stay valid for 12 months and roll over independently — they're never lost when your monthly credits reset.",
    items: [
      { name: "Starter", credits: "1,000 credits", price: "$20" },
      { name: "Growth", credits: "3,000 credits", price: "$45" },
    ],
  },
};

export const STATS = {
  heading: {
    muted: "Your team already knows the workflow. ",
    emphasis: "Helpperr turns it into documentation.",
  },
  items: [
    { value: "10x", label: "Faster than writing docs manually" },
    { value: "90%", label: "Less manual writing" },
    { value: "5min", label: "Average time to publish a guide" },
    { value: "3.5hrs", label: "Saved per person, per week" },
  ],
};

export const USE_CASES = {
  badge: "USE CASES",
  heading: "Built for every team and workflow.",
  description: "From onboarding to compliance — Helpperr adapts to how your team works.",
  items: [
    { icon: "UserPlus", label: "Customer Onboarding" },
    { icon: "MonitorPlay", label: "Product Walkthroughs" },
    { icon: "GraduationCap", label: "Employee Training" },
    { icon: "ClipboardList", label: "Standard Operating Procedures (SOPs)" },
    { icon: "BookOpen", label: "Internal Knowledge Base" },
    { icon: "FileCode", label: "Software Documentation" },
    { icon: "Headset", label: "Customer Support" },
    { icon: "Server", label: "IT Process Documentation" },
    { icon: "Presentation", label: "Sales Enablement" },
    { icon: "Users2", label: "HR & Compliance Training" },
  ],
};

export const FAQ = {
  heading: "Frequently Asked Questions",
  sub: "Do you want to learn more about us, let's go the blog page.",
  items: [
    {
      question: "How is Helpperr different from standard screen recorders?",
      answer:
        "Standard tools only record video. Helpperr generates structured, searchable, editable documentation from your recording—with annotated screenshots, AI-written steps, and a knowledge management layer. You get both a video and a fully formatted guide.",
      defaultOpen: true,
    },
    {
      question: "How is Helpperr different from other guide creators?",
      answer:
        "Helpperr goes beyond basic guide creation. It offers a full knowledge management platform, a powerful visual editor, workspace administration, and enterprise-grade publishing—making it a complete documentation solution.",
      defaultOpen: false,
    },
    {
      question: "Can I edit AI-generated guides?",
      answer:
        "Yes. Every AI-generated guide is fully editable in the visual editor. You can update text, rearrange steps, replace screenshots, and add annotations before publishing.",
      defaultOpen: false,
    },
    {
      question: "Can I export documentation?",
      answer:
        "Absolutely. Guides can be exported to PDF or Markdown, and embedded into any platform via iFrame—including Notion, Confluence, Zendesk, and more.",
      defaultOpen: false,
    },
    {
      question: "Does Helpperr support company branding?",
      answer:
        "Yes. Enterprise plans include custom branding—your logo, colors, and domain—applied across all published guides and knowledge bases.",
      defaultOpen: false,
    },
    {
      question: "Can I reuse existing content?",
      answer:
        "Yes. Helpperr is built for content reuse. You can clone, repurpose, and update guides across teams and products without starting from scratch.",
      defaultOpen: false,
    },
    {
      question: "Do I need design or documentation experience?",
      answer:
        "Not at all. If you can do your job, you can use Helpperr. Just click record, complete your workflow, and the AI handles the rest.",
      defaultOpen: false,
    },
    {
      question: "Is Helpperr suitable for teams?",
      answer:
        "Absolutely. Helpperr is built for teams of all sizes—from small startups to large enterprises. Shared workspaces, role-based access, and admin controls make team collaboration seamless.",
      defaultOpen: false,
    },
  ],
};

export const CTA = {
  heading: ["Ready to Transform", " Documentation?"],
  primaryCta: "Get Started",
  secondaryCta: "Book a Demo",
};

export const FOOTER = {
  brand: "Helpperr",
  watermark: "Helpperr",
  description:
    "The AI documentation platform that turns any workflow into professional, reusable knowledge - instantly.",
  cta: {
    heading: ["Turn every workflow into", "documentation in minutes"],
    sub: "Start free today — record once and let Helpperr write the guide for you.",
    placeholder: "Enter your email",
    button: "Get started",
    perks: ["No credit card required", "Free Chrome extension"],
  },
  columns: [
    {
      title: "Product",
      links: [
        { label: "How it Works", href: "/#how-it-works" },
        { label: "Why Helpperr", href: "/#platform" },
        { label: "Product Showcase", href: "/#product-showcase" },
        { label: "Use Cases", href: "/#use-cases" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Book a Demo", href: "/#cta" },
        { label: "Chrome Extension", href: "/#hero" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
      ],
    },
  ],
  social: { label: "Follow us" },
  copyright: "© 2026 Helpperr Inc. All rights reserved.",
  tagline: "Made with ♥ for teams who document",
};

// Pricing page (/pricing). Every value below is derived from the PRICING plans
// above — keep the two in sync when plan details change. In comparison rows a
// string is shown as-is, `true` renders a check and `false` a dash.
export const PRICING_PAGE = {
  badge: "PRICING",
  heading: "Plans that grow with your documentation",
  sub: "Start free, upgrade when you need more credits, and bring your team along when you're ready. Every plan runs on AI credits — pay for what you actually generate.",
  compareLink: "Compare all plans",
  comparison: {
    badge: "COMPARE",
    heading: "Compare plans side by side",
    sub: "Everything included in each plan, so you can pick the right fit at a glance.",
    groups: [
      {
        title: "Pricing",
        rows: [
          { label: "Price", values: ["$0", "$15 / month", "$25 / seat / month"] },
          { label: "Free trial", values: ["14 days", false, false] },
          { label: "Credit card required", values: ["No", "Yes", "Yes"] },
          { label: "Billed to", values: [false, "Your user account", "The workspace"] },
        ],
      },
      {
        title: "Credits",
        rows: [
          { label: "AI credits", values: ["100 total", "700 / month", "1,200 / seat / month"] },
          { label: "Credits refresh monthly", values: [false, true, true] },
          { label: "Shared team credit pool", values: [false, false, true] },
          { label: "Credit top-ups", values: [false, true, true] },
        ],
      },
      {
        title: "Workspace",
        rows: [
          { label: "Users", values: ["1", "1", "2–15"] },
          { label: "Workspace", values: ["Personal", "Personal", "Shared team"] },
          { label: "View & share guides", values: [true, true, true] },
        ],
      },
    ],
  },
  faq: {
    heading: "Pricing FAQs",
    sub: "Everything you need to know about plans, credits and billing.",
    items: [
      {
        question: "What is an AI credit?",
        answer:
          "Credits are what Helpperr spends when its AI turns your recordings into documentation. Every plan includes a set number of credits — on the Free plan a single generation can use up to 30.",
        defaultOpen: true,
      },
      {
        question: "Do I need a credit card to start?",
        answer:
          "No. The Free plan gives you 100 credits for 14 days, or until the credits run out, with no credit card required.",
        defaultOpen: false,
      },
      {
        question: "What happens when I run out of credits?",
        answer:
          "On Pro and Team you can top up anytime: 1,000 credits for $20 or 3,000 credits for $45.",
        defaultOpen: false,
      },
      {
        question: "Do unused credits roll over?",
        answer:
          "Plan credits refresh every month. Purchased top-up credits are separate — they stay valid for 12 months and roll over independently, so they're never lost when your monthly credits reset.",
        defaultOpen: false,
      },
      {
        question: "What happens to my guides when the trial ends?",
        answer:
          "You can still view and share every guide you created during the trial. Upgrade to Pro or Team to keep generating new ones.",
        defaultOpen: false,
      },
      {
        question: "How does Team billing work?",
        answer:
          "Team is $25 per seat per month, from 2 to 15 seats. Each seat adds 1,200 credits to a shared pool the whole workspace can use, and the plan is billed to the workspace rather than to an individual.",
        defaultOpen: false,
      },
      {
        question: "Which plan is right for me?",
        answer:
          "Choose Pro if you document on your own and need a steady monthly allowance. Choose Team if several people create guides and you want one shared credit pool and workspace billing.",
        defaultOpen: false,
      },
      {
        question: "We need more than 15 seats. What are our options?",
        answer:
          "Book a demo and tell us about your team — we'll help you find the right setup.",
        defaultOpen: false,
      },
    ],
  },
};

// "Ask a Question" card shown under every FAQ heading, linking to /contact.
export const FAQ_ASK = {
  title: "Ask a Question",
  body: "Can't find what you're looking for? Contact us and our team will get back to you promptly.",
  cta: "Ask a Question",
  href: "/contact",
};

// Contact page (/contact). The form has no backend yet — submitting shows a
// confirmation only, like the Book a Demo modal.
export const CONTACT_PAGE = {
  badge: "CONTACT",
  heading: "Let's talk",
  sub: "Questions about Helpperr, plans or your team's setup? Send us a message and we'll get back to you by email.",
  topics: ["General question", "Pricing & plans", "Team or enterprise", "Technical support"],
  side: [
    {
      icon: "CalendarDays",
      title: "Prefer a walkthrough?",
      body: "Book a demo and we'll show you Helpperr on your own workflows.",
      cta: "Book a Demo",
      action: "demo",
    },
    {
      icon: "CircleHelp",
      title: "Browse the FAQs",
      body: "Quick answers about credits, plans, exports and teams.",
      cta: "Read the FAQs",
      action: "/#faq",
    },
  ],
  success: {
    title: "Message sent",
    body: "Thanks for reaching out — our team will reply by email shortly.",
  },
};
