import './globals.css';
import QueryProvider from 'src/lib/QueryPrivider';
import JotaiProvider from 'src/lib/JotaiProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {' '}
        <QueryProvider>
          <JotaiProvider>{children}</JotaiProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
