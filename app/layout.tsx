import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NoteHub — create and save notes online",
  description: "Note-taking site",
  openGraph: {
    title: "NoteHub — create and save notes online",
    description: "Note-taking site",
    url: `https://07-routing-nextjs-khaki-pi.vercel.app/`,
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
  <body className={roboto.variable}>
    <AuthProvider>
      <TanStackProvider>
        <Header />

        {children}
        {modal}
        <div id="modal-root" />

        <Footer />
      </TanStackProvider>
    </AuthProvider>
  </body>
</html>

  );
}
