import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CleanCarbonTracks — Smart Municipal Waste & Carbon Reduction Platform',
  description:
    'Track garbage pickups, categorize waste with AI, report sanitation issues, and monitor eco-fleet fuel efficiency.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        {children}
      </body>
    </html>
  );
}
