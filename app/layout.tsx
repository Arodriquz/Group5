import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agri-Connect JA',
  description: 'Empowering Agriculture, Growing Jamaica',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Agri-Connect JA',
  },
};

export const viewport: Viewport = {
  themeColor: '#022c22',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/images/logo.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}