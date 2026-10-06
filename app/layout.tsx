import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: "TeckDrop — Find. Verify. Track. Farm.", template: "%s | TeckDrop" },
  description: "Airdrop intelligence platform for discovering, verifying, and tracking crypto opportunities.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}