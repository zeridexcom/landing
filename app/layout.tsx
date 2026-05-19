import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Edufast Mega Combo Bundle",
  description: "1000+ Courses, 30,000+ Assets, Lifetime Access",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Montserrat:wght@700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-surface font-body-md antialiased pb-[80px] md:pb-0">
        {children}
      </body>
    </html>
  );
}
