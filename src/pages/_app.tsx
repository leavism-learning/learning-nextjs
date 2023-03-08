import '@/styles/globals.css'
import Navbar from 'components/Navbar'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { UserContext } from 'lib/context'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <UserContext.Provider value={{ user: {}, username: 'Jeff'}}>
        <Navbar/>
        <Component {...pageProps} />
        <Toaster/>
      </UserContext.Provider>
    </>
  )
}
