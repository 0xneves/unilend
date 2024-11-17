import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "Unilend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
