import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KashFlow | Budget Tracker",
  description: "by Priyanshu Bharti",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="dark"
      style={{ colorScheme: "dark" }}
    >
      <body className={`${inter.className} flex flex-col min-h-screen w-full `}>
        <ThemeProvider>
       
          <Navbar />
          <main className="flex grow container mx-auto max-w-7xl ">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
