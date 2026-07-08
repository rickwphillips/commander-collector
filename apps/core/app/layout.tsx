import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthGuard } from './components/AuthGuard';
import './globals.scss';

export const metadata: Metadata = {
  title: 'The Commander Collector',
  description: 'Track your Magic: The Gathering Commander game results',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Fill the screen edge-to-edge on notched iPhones instead of letterboxing the
  // page inside the safe area (which shows a black band above/around the panel).
  // Pages that need to keep content clear of the notch/home indicator pad with
  // env(safe-area-inset-*), which only returns real values under 'cover'.
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthGuard>{children}</AuthGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
