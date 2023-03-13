import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

import { UserContext } from 'lib/context';
import { useUserData } from 'lib/hooks';

import Navbar from 'components/Navbar'

import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const userData = useUserData();

  return (
    <>
      <UserContext.Provider value={userData}>
        <Navbar/>
        <Component {...pageProps} />
        <Toaster/>
      </UserContext.Provider>
    </>
  )
}
