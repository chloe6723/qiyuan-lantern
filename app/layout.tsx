import type { Metadata, Viewport } from 'next';
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
  metadataBase: new URL('https://qiyuan-lotus-wishes.chenxiaoyi6723.chatgpt.site'),
  title: '祈愿灯 · 水月新境',
  description: '写下心愿，放飞孔明灯或放流莲花灯，让灯火替你珍藏每一念。',
  openGraph: {
    title: '祈愿灯 · 水月新境',
    description: '写下心愿，放飞孔明灯或放流莲花灯，让灯火替你珍藏每一念。',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '祈愿灯 · 水月新境',
    description: '写下心愿，放飞孔明灯或放流莲花灯，让灯火替你珍藏每一念。',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
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
