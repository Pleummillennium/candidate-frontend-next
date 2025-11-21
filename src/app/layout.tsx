import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Management System",
  description: "Modern task management system with real-time collaboration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
