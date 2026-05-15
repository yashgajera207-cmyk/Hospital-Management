import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "MediCare Pro",
  description: "Best Hospital Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3000}
        />
      </body>
    </html>
  );
}