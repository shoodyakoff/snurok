import type { Metadata } from 'next'
import { Onest } from 'next/font/google'
import './globals.css'

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-onest',
  preload: true,
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Shnurok — Умный подбор кроссовок',
  description: 'Расскажи что ищешь — подберем кроссовки за 2 минуты',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={onest.variable}>
      <body className="font-onest">{children}</body>
    </html>
  )
}
