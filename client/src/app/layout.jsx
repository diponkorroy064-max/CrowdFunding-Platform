import "./globals.css";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/common/Navbar";
import FooterWrapper from "@/components/common/FooterWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata = {
  title: "CrowdSpark | Empowering Ideas Through Community Funding",
  description: "CrowdSpark connects creators with passionate supporters to bring ideas, creative projects, and positive causes to life with Next.js and Better Auth.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'><path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/></svg>",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <FooterWrapper />
        </AuthProvider>
      </body>
    </html>
  );
}
