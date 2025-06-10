import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/support/live-chat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jeevanik - Find Your Perfect Life Partner",
  description:
    "India's most trusted matrimony platform. Find your perfect life partner from thousands of verified profiles. Join millions of happy couples who found love through our platform.",
  keywords:
    "matrimony, marriage, wedding, Indian brides, Indian grooms, life partner, shaadi",
  authors: [{ name: "Jeevanik Platform" }],
  openGraph: {
    title: "Jeevanik - Find Your Perfect Life Partner",
    description:
      "India's most trusted matrimony platform with verified profiles",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeevanik - Find Your Perfect Life Partner",
    description:
      "India's most trusted matrimony platform with verified profiles",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning={true}>
          <Providers>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <ChatWidget />
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
