import Nav from "./components/nav";
import Footer from "./components/footer";
import "./globals.css";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata = {
  title: "Kaizen",
  description:
    "Kaizen is an Anime and Manga Site, Which shows the latest trending.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className={`${nunito.className}`}>
          <Nav />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
