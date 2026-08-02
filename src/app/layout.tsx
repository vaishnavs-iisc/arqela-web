import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/components/AuthProvider';

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
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
