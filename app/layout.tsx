import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProvider from "@/components/SessionProvider";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Board App",
  description: "A professional platform for finding and posting jobs.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <SessionProvider session={session}>
          {/* Main Layout Wrapper */}
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Main Content Area - Updated Padding */}
            {/* ADDED pt-24 (which is h-16 + py-8) to ensure content starts below the fixed navbar. */}
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-8">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
