'use client'
import Navbar from '@/components/Navbar'
import { ConfigProvider, theme } from 'antd'
import './globals.css'
import Footer from '@/components/Footer'
const metadata = {
  title: 'fundfusion',
  description: 'FundFusion is a blockchain-based all-in-one funding platform that provides accessible, secure, and efficient funding solutions for individuals, organizations, and causes seeking funding for their projects.',
}

export default function RootLayout({ children }) {
  return (
    <html className="dark" lang="en">
      <body className="min-h-screen flex flex-col">
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
          }}
        >

          <Navbar />
          {children}
          <Footer />
        </ConfigProvider>


      </body>
    </html>
  )
}
