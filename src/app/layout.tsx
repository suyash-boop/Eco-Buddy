import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import { CalculatorProvider } from "@/context/CalculatorContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EcoBuddy",
  description: "Your partner in sustainability",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ChatProvider>
            <CalculatorProvider>
              <div>
                <Sidebar />
                <div className="ml-64 flex flex-col h-screen overflow-hidden">
                  <Navbar />
                  <main className="flex-1 overflow-y-auto p-6 bg-black">
                    {children}
                  </main>
                </div>
              </div>
            </CalculatorProvider>
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
