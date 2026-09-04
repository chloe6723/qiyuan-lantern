import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yuan-deng-wishes.chenxiaoyi6723.chatgpt.site'),
  title: '祈愿灯 · 一念入星河',
  description: '写下心愿，放飞一盏属于你的孔明灯。',
  openGraph: {
    title: '祈愿灯 · 一念入星河',
    description: '写下心愿，放飞一盏属于你的孔明灯。',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '祈愿灯 · 一念入星河',
    description: '写下心愿，放飞一盏属于你的孔明灯。',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
