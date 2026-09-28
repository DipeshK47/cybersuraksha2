import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  IBM_Plex_Mono,
  Manrope,
} from "next/font/google";
import { headers } from "next/headers";
import { HandbookChatbot } from "./components/HandbookChatbot";
import "./globals.css";
import "./cybersuraksha.css";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const description =
  "CyberSuraksha turns Computational Thinking and Artificial Intelligence into hands-on learning missions for Classes 3-10.";

const themeBootScript = `
  (() => {
    try {
      const saved = localStorage.getItem("cybersuraksha-theme");
      const theme = saved || "light";
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (_) {}
  })();
`;

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") ? "http" : "https");
  const origin = host ? `${protocol}://${host}` : "http://localhost:3000";
  const socialImage = `${origin}/og.png`;

  return {
    title: {
      default: "CyberSuraksha",
      template: "%s — CyberSuraksha",
    },
    description,
    icons: {
      icon: "/favicon.svg",
    },
    openGraph: {
      title: "CyberSuraksha",
      description,
      type: "website",
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: "CyberSuraksha — Think. Build. Discover.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "CyberSuraksha",
      description,
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body
        className={`${manrope.variable} ${ibmPlexMono.variable} ${bricolage.variable}`}
      >
        {children}
        <HandbookChatbot />
      </body>
    </html>
  );
}
