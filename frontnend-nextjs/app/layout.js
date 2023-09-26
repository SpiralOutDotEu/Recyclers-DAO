import './globals.css'
import { Inter } from 'next/font/google'
import Header from "./components/header/Header";
import { WalletProvider } from './contexts/WalletContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Recyclers DAO',
  description: 'Revolutionizing Image Data for a Cleaner Future',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className={inter.className}>
      <WalletProvider>
        <Header />
        {children}
        </WalletProvider>
      </body>
    </html>
  )
}
