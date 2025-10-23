import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignedIn,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Workout App - Track Your Fitness Journey',
  description: 'Track your workouts, set goals, and build lasting fitness habits',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <SignedIn>
            <header className="sticky top-0 z-50 flex justify-end items-center p-4 gap-4 h-16 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
              <UserButton />
            </header>
          </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}