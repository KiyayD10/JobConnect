export const metadata = {
  title: 'JobConnect API Service',
  description: 'Backend API untuk Website JobConnect',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}