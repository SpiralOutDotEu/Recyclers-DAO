import './globals.css'
import { Inter } from 'next/font/google'
import Header from "./components/header/Header";
import { WalletProvider } from './contexts/WalletContext';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Recyclers DAO',
  description: 'Revolutionizing Image Data for a Cleaner Future',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className={inter.className}>
      <div>
      <Head>
        <title>Recyclers DAO</title>
        <meta name="description" content="Revolutionizing Image Data for a Cleaner Future" key="desc" />
        <meta property="og:title" content="Recyclers DAO: Earn tokens - Save environment" />
        <meta
          property="og:description"
          content="Revolutionizing Image Data for a Cleaner Future"
        />
        <meta
          property="og:image"
          content="https://recyclers-dao.vercel.app/_next/image?url=%252FRecyclersDAO-YouTube-Thumbnail.png"
        />
      </Head>
    </div>
      <WalletProvider>
        <Header />
        {children}
        </WalletProvider>
      </body>
    </html>
  )
}
