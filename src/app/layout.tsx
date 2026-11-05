import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChromaDeck — Per-Monitor Display Colour Presets for Windows",
  description:
    "ChromaDeck is a free per-monitor display colour manager for Windows. Save colour presets for brightness, contrast, gamma, RGB gains, vibrance and hue, then apply, pin and enforce them per monitor.",
  openGraph: {
    type: "website",
    siteName: "ChromaDeck",
    title: "ChromaDeck — Per-Monitor Display Colour Presets for Windows",
    description:
      "Free per-monitor colour manager for Windows. Save presets and apply, pin, or enforce them per monitor with an NVCP-native engine.",
    url: "https://chromadeck.github.io/",
    images: [
      {
        url: "https://chromadeck.github.io/app/dashboard.png",
        alt: "The ChromaDeck preset library interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChromaDeck — Per-Monitor Display Colour Presets for Windows",
    description:
      "Free per-monitor colour manager for Windows — presets, pinning and enforcement per display.",
    images: ["https://chromadeck.github.io/app/dashboard.png"],
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  themeColor: "#060608",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning on <html>: MotionProvider mirrors the
    // reduced-motion preference onto this element, and browser extensions
    // routinely inject attributes here before React hydrates. Neither is a
    // render mismatch, so suppressing the warning on this one node is correct.
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://chromadeck.github.io/" />
        <link rel="canonical" href="https://chromadeck.github.io/" />
        <link rel="icon" type="image/png" href="/chromadeck.png" />
        <link rel="apple-touch-icon" href="/chromadeck.png" />
      </head>
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
