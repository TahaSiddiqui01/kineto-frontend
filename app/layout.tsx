import type { Metadata } from "next";
import { Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Toaster } from "sonner";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Kineto",
  description: "Kineto is a no code tool to build the conversational bot",
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
      className={`${geistMono.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
            <Toaster richColors position="top-right" />
          </QueryProvider>
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
