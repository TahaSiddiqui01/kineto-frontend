import type { Metadata } from "next";
import { Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Toaster } from "sonner"

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
      className={`${geistMono.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
