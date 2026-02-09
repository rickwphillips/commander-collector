import type { Metadata } from 'next';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthGuard } from './components/AuthGuard';
import './globals.scss';

export const metadata: Metadata = {
  title: 'The Commander Collector',
  description: 'Track your Magic: The Gathering Commander game results',
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
