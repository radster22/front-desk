//import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";  // Ensure your global styles are properly imported
import React from "react";

// Load the Geist and Geist_Mono fonts from Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for the page (this will be used in the head)
export const metadata: Metadata = {
  title: "Login App",  // Change the title to something more descriptive
  description: "Login Page for Internal and External Candidates", // Description update
};

// Root layout that wraps around all pages
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`} // Background color added
      >
        {/* You can add your global navigation here, such as a header or footer */}
          {children}
      </body>
    </html>
  );
}
