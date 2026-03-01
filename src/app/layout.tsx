import type { Metadata } from 'next';
import { Inter, Lexend, JetBrains_Mono } from 'next/font/google';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { ThemeContextProvider } from '@/contexts/ThemeContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'WriteCraft - Master English through Practice',
  description: 'AI-powered English translation practice and SRS flashcards.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${lexend.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans">
        <ThemeContextProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
