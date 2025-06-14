// src/app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ambulance Claim Tracker",
  description: "Track your ambulance claims with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <Script src="//cdn.jsdelivr.net/npm/sweetalert2@11" strategy="beforeInteractive"></Script>
      </head>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 transition-colors duration-300 h-full flex flex-col`}>{children}</body>
    </html>
  );
}