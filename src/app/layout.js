// pvramid/ambulance-track/ambulance-track-1d0d37eaed18867f1ddff8bf2aff81949149a05b/src/app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ambulance Claim Tracker",
  description: "Track your ambulance claims with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>{children}</body>
    </html>
  );
}