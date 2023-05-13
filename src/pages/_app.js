import '@/styles/globals.css'
import '../styles/home.css'
import '../styles/signup_login.css'
import { AuthContextProvider } from './authContext'

export default function App({ Component, pageProps }) {
  return <AuthContextProvider><Component {...pageProps} /></AuthContextProvider>
}