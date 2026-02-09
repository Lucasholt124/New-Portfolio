import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import Script from "next/script";
import { VisualEditing } from "next-sanity/visual-editing";

// Components
import { SanityLive } from "@/sanity/lib/live";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/DarkModeToggle";
import { FloatingDock } from "@/components/FloatingDock";
import SidebarToggle from "@/components/SidebarToggle";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DisableDraftMode } from "@/components/DisableDraftMode";

// Styles
import "../globals.css";

// Font configurations
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// SEO Metadata
export const metadata: Metadata = {
  title: {
    default: "Lucas Aragão | Desenvolvedor Full Stack & Designer",
    template: "%s | Lucas Aragão",
  },
  description: "Desenvolvedor Full Stack especializado em React, Next.js, Node.js e TypeScript. Criando experiências digitais excepcionais com foco em performance e usabilidade.",
  keywords: [
    "desenvolvedor",
    "full stack",
    "react",
    "next.js",
    "typescript",
    "node.js",
    "portfolio",
    "freelancer",
    "programador",
    "web developer"
  ],
  authors: [{ name: "Lucas Aragão" }],
  creator: "Lucas Aragão",
  publisher: "Lucas Aragão",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://new-portfolio-delta-blond.vercel.app/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lucas Aragão | Desenvolvedor Full Stack & Designer",
    description: "Desenvolvedor Full Stack especializado em criar soluções digitais inovadoras",
    url: "/",
    siteName: "Lucas Aragão Portfolio",
    images: [
      {
        url: "/og-image.jpg", // Adicione uma imagem OG
        width: 1200,
        height: 630,
        alt: "Lucas Aragão - Portfolio",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <ClerkProvider
  appearance={{
    baseTheme: undefined,
    variables: {
      colorPrimary: "#3b82f6",
      colorBackground: "#ffffff",
      colorText: "#1f2937",
      colorTextSecondary: "#6b7280",
      colorInputBackground: "#ffffff",
      colorInputText: "#1f2937",
      colorNeutral: "#374151",
    },
    elements: {
      // Modal/Card principal
      card: "bg-white shadow-xl border border-gray-200",
      modalContent: "bg-white",
      modalBackdrop: "bg-black/50",

      // Header
      headerTitle: "text-gray-900",
      headerSubtitle: "text-gray-600",

      // Formulários
      formFieldLabel: "text-gray-700",
      formFieldInput:
        "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400",
      formFieldInputShowPasswordButton: "text-gray-500",

      // Botões
      formButtonPrimary:
        "bg-blue-500 hover:bg-blue-600 text-white shadow-md",
      formButtonReset: "text-blue-500 hover:text-blue-600",

      // Links
      footerActionLink: "text-blue-500 hover:text-blue-600",
      footerActionText: "text-gray-600",

      // Social buttons (Google, GitHub, etc.)
      socialButtonsBlockButton:
        "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
      socialButtonsBlockButtonText: "text-gray-700",
      socialButtonsProviderIcon: "brightness-100",

      // Divider
      dividerLine: "bg-gray-300",
      dividerText: "text-gray-500",

      // User Button (avatar no canto)
      userButtonBox: "shadow-none",
      userButtonTrigger: "shadow-none",
      userButtonPopoverCard:
        "bg-white border border-gray-200 shadow-xl",
      userButtonPopoverActionButton: "text-gray-700 hover:bg-gray-100",
      userButtonPopoverActionButtonText: "text-gray-700",
      userButtonPopoverFooter: "border-t border-gray-200",

      // User Profile
      profileSectionTitle: "text-gray-900",
      profileSectionContent: "text-gray-700",
      profileSectionPrimaryButton: "text-blue-500",

      // Alerts
      alertText: "text-gray-700",

      // Badge
      badge: "bg-blue-100 text-blue-700",

      // Internal/Root
      rootBox: "bg-transparent",

      // Identifiers
      identityPreview: "bg-gray-50 border border-gray-200",
      identityPreviewText: "text-gray-700",
      identityPreviewEditButton: "text-blue-500",

      // OTP Input
      otpCodeFieldInput: "bg-white border-gray-300 text-gray-900",

      // Select
      selectButton: "bg-white border-gray-300 text-gray-900",
      selectOptionsContainer: "bg-white border-gray-200",
      selectOption: "text-gray-700 hover:bg-gray-100",
    },
  }}
>
      <html
        lang="pt-BR"
        suppressHydrationWarning
        className="scroll-smooth"
      >
        <head>
          {/* Preconnect to external domains for better performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://cdn.platform.openai.com" />
          <link rel="dns-prefetch" href="https://cdn.sanity.io" />

          {/* Additional SEO tags */}
          <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
          <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        </head>

        <body
          className={`
            ${geistSans.variable}
            ${geistMono.variable}
            font-sans
            antialiased
            min-h-screen
            bg-background
            text-foreground
            selection:bg-primary/20
            selection:text-primary
          `}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="portfolio-theme"
          >
            {/* OpenAI ChatKit Script */}
            <Script
              id="openai-chatkit"
              src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
              strategy="afterInteractive"
              defer
            />

            {/* Main Layout Structure */}
            <SidebarProvider defaultOpen={false}>
              {/* Main Content Area */}
              <SidebarInset className="relative min-h-screen">
                <main className="relative">
                  {children}
                </main>
              </SidebarInset>

              {/* Right Sidebar with AI Chat */}
              <AppSidebar side="right" />

              {/* Floating Elements */}
              <div className="fixed-elements">
                {/* Floating Dock Navigation */}
                <FloatingDock />

                {/* Sidebar Toggle Button */}
                <SidebarToggle />

                {/* Theme Toggle Button */}
                <div
                  className={`
                    fixed z-20 transition-all duration-300
                    top-4 right-[4.5rem]
                    md:bottom-6 md:right-24 md:top-auto
                  `}
                  aria-label="Alternar tema"
                >
                  <div className="theme-toggle-container">
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </SidebarProvider>

            {/* Sanity Live Preview */}
            <SanityLive />

            {/* Draft Mode UI */}
            {isDraftMode && (
              <div className="draft-mode-ui">
                <VisualEditing />
                <DisableDraftMode />
              </div>
            )}

            {/* Skip to main content for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-background text-foreground p-2 rounded-md z-50"
            >
              Pular para o conteúdo principal
            </a>
          </ThemeProvider>

          {/* No Script fallback */}
          <noscript>
            <div className="noscript-warning">
              Este site funciona melhor com JavaScript habilitado.
            </div>
          </noscript>
        </body>
      </html>
    </ClerkProvider>
  );
}