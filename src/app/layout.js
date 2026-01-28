import './globals.css'
import Head from 'next/head'

export const metadata = {
  title: 'BrainBuffer | Visual Memory Training',
  description: 'Boost your cognitive speed with BrainBuffer. Memorize floating numbers, challenge your short-term recall, and compete for the high score in this fast-paced brain training game.',
  keywords: ['memory game', 'brain training', 'cognitive test', 'visual memory', 'puzzle game', 'mind game'],
  authors: [{ name: 'Muhammad Yasir' }],
  applicationName: 'BrainBuffer',
  openGraph: {
    title: 'BrainBuffer - Can you beat the high score?',
    description: 'Test your short-term memory speed. Memorize the bubbles before they vanish!',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <body className="bg-white text-slate-800 antialiased">
        {children}
      </body>
    </html>
  )
}
