import type { Metadata } from "next";
import ThemeRegistry from "@/theme/ThemeRegistry";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Candidate Management System",
  description: "Track and manage interview candidates efficiently with status tracking and interview notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Navbar />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
