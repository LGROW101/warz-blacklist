import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'ตรวจสอบคนโกง - เช็คก่อนซื้อขายในเกม',
  description: 'ค้นหาและรายงานคนโกงในการซื้อขายของในเกม ป้องกันการถูกหลอก',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon.jpeg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon.jpeg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.jpeg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icon.jpeg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
