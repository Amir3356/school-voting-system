import './globals.css'

export const metadata = {
  title: 'School Voting System',
  description: 'Democratic voting platform for schools',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  )
}
