import './globals.css'

export const metadata = {
  title: 'fundfusion',
  description: 'FundFusion is a blockchain-based all-in-one funding platform that provides accessible, secure, and efficient funding solutions for individuals, organizations, and causes seeking funding for their projects.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}