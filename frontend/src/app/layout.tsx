import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/context/AuthContext'
import { LanguageProvider } from '@/lib/context/LanguageContext'

export const metadata: Metadata = {
  title: 'Sahara Student Services - UK & US Study Pathways',
  description: 'Expert education consultancy for UK and US university admissions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="pt-20">
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
