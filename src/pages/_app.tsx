// src/pages/_app.tsx
import 'styles/globals.css'
import 'styles/tailwind.css'
import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ModalProvider, ToastProvider } from '@apideck/components'
import { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ToastProvider>
      <ModalProvider>
        <Component {...pageProps} />
        <Analytics />
      </ModalProvider>
    </ToastProvider>
  )
}