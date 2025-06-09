import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoBuddy - Carbon Footprint Tracker",
  description: "Track and reduce your carbon footprint with EcoBuddy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <div className="flex">
          <Sidebar />
          {/* Main content area - full width on mobile, offset on desktop */}
          <main className="flex-1 w-full md:w-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}