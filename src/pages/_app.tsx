import 'styles/globals.css'
import 'styles/tailwind.css'
import 'font-awesome/css/font-awesome.min.css';
import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ModalProvider, ToastProvider } from '@apideck/components'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';


export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <>
      <ToastProvider>
        <ModalProvider>
          {router.pathname !== '/' && (
            <nav className="w-full flex justify-center items-center py-4 bg-white dark:bg-gray-800 shadow-sm pb-4" style={{height: '70px'}}>
              {router.pathname !== '/' && (
                <div className="absolute left-0 pl-4">
                  <button 
                    onClick={handleBackClick}
                    className="px-6 py-3 rounded bg-white hover:border hover:border-indigo-500 cursor-pointer font-semibold text-md dark:bg-gray-800 dark:text-white dark:hover:border-indigo-500"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </button>
                </div>
              )}
              <div className="flex justify-center">
                <Image src="/logo.svg" alt="Logo" width={150} height={150} />
              </div>
            </nav>
          )}
          <Component {...pageProps} />
        </ModalProvider>
      </ToastProvider>
      <Analytics />
    </>
  )
}