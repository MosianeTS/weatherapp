import { Poppins } from "next/font/google";

import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "700"],  
  variable: "--font-poppins", 
  subsets: ["latin"],
});

export const metadata = {
  title: "Weather App",
  description: "Weather application with theme toggling",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.variable}>
        {children}
      </body>
    </html>
  );
}