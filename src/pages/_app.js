import '@/styles/globals.css'
import '../styles/home.css'
import '../styles/signup_login.css'
import '../styles/account.css'
import '../styles/discover.css'
import AuthContextProvider from './authContext'

export default function App({ Component, pageProps }) {
  return <AuthContextProvider><Component {...pageProps} /></AuthContextProvider>
}