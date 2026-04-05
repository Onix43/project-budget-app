import type { Metadata } from "next";
import { Inter } from "next/font/google";
import  "./globals.css";
import "modern-normalize";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const inter = Inter({
  variable: "--font-geist-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "A simple app to track your expences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <TanStackProvider>
        <AuthProvider>
          <body>
            <Header />
            <div className="container">
              {children}
            </div>
          </body>
        </AuthProvider>
      </TanStackProvider>
    </html>
  );
}
