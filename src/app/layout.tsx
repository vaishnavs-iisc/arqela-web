import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from '@/components/AuthProvider';
import { WebVitals } from '@/components/WebVitals';
import { CSPostHogProvider } from '@/components/PostHogProvider';
import { PostHogPageView } from '@/components/PostHogPageView';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arqela",
  description: "Stress test scientific ideas and strengthen research hypotheses",
  icons: {
    icon: "/arqela-logo.png",
    apple: "/arqela-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`min-h-full flex flex-col ${inter.className}`}>
        <WebVitals />
        <CSPostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          <AuthProvider>{children}</AuthProvider>
        </CSPostHogProvider>
      </body>
    </html>
  );
}
