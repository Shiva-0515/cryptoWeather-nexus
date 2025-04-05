import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '../redux/provider';
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CryptoWeather Nexus',
  description: 'Real-time crypto prices and weather updates',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
