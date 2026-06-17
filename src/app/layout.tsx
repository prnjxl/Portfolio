import "./globals.css";
import { Inter } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import ThemeProvider from "@/components/ThemeProvider";
import FloatingMenu from "@/components/FloatingMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Portfolio",
  description: "Portfolio Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <CustomCursor />
          <FloatingMenu />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}