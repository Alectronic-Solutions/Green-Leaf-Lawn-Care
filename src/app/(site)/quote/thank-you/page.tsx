import type { Metadata } from "next";
import { ThankYou } from "./thank-you";

export const metadata: Metadata = {
  title: "Thanks, we got your request",
  robots: { index: false, follow: false },
  alternates: { canonical: "/quote/thank-you" },
};

export default function ThankYouPage() {
  return <ThankYou />;
}
