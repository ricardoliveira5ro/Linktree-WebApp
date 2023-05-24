import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useState, useEffect, useRef } from 'react'
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import Script from 'next/script'
import Image from 'next/image';
import Link from 'next/link';
import firebase_app from '../../firebase-config'
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [windowHeight, setWindowHeight] = useState(null)
  const searchRef = useRef(null)
  const [emailData, setEmailData] = useState({ emailTemp: '' });
  const [searchInfo, setSearchInfo] = useState({ searchInfo: '' });

  const auth = getAuth(firebase_app);
  const router = useRouter();

  //Window size
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  //Click outside search
  useEffect(() => {
    const handleClickOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        toggleSearch(true)
      }
    }

    const handleTouchOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        toggleSearch(true)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleTouchOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleTouchOutside)
    }
  }, [searchRef])

  const handleMyAccount = () => {
    auth.currentUser ? router.push('/account') : router.push('/login')
  }

  const discover = () => {
    console.log(searchInfo)
    router.push({
      pathname: '/discover',
      query: { searchInfo: searchInfo }
    })
  }

  return (
    <>
      <Script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></Script>
      <Head>
        <title>Linktree</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className='background' style={{ minHeight: windowHeight }}>
        <div className='header'>
          <Image className='logo' src='https://ik.imagekit.io/ricardo5ro/Linktree/logo/linktree_black.png?updatedAt=1681143068053' alt='Linktree Logo' width={1500} height={420}></Image>
          <Image className='logo_icon' src='https://ik.imagekit.io/ricardo5ro/Linktree/logo/icon_Fy3Lvr137?updatedAt=1683017622032' alt='Linktree Icon' width={320} height={270}></Image>
          <ul className='menu'>
            <Link href='/'><li className='menu1'>Home</li></Link>
            <li className='menu2'>|</li>
            <a id='discover' onClick={() => toggleSearch(false)}><li className='menu3'>Discover</li></a>
            <li id='search' className='search' ref={searchRef}>
              <a className='cursor-pointer' onClick={discover}><Image src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/search__1_.png?updatedAt=1681465571645' alt='Search Icon' width={200} height={200}></Image></a>
              <input placeholder='Type something' autoComplete='off' onChange={(e) => setSearchInfo(e.target.value)}></input>
            </li>
          </ul>
          <div className='accountDiv'>
            <div className='miniSearch'>
              <a className='cursor-pointer' onClick={discover}><Image src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/search__1_.png?updatedAt=1681465571645' alt='Search Icon' width={150} height={150}></Image></a>
              <input placeholder='Type something' autoComplete='off' onChange={(e) => setSearchInfo(e.target.value)}></input>
            </div>
            <a className='profileIcon' href=''><Image src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/profile-user.png?updatedAt=1682980525659' alt='Profile Icon' width={220} height={220}></Image></a>
            <button onClick={handleMyAccount}>MY ACCOUNT</button>
          </div>
        </div>
        <div className='main'>
          <div className='content'>
            <div>
              <h1 className='animate__animated animate__pulse animate__infinite'>Link once, share everywhere.</h1>
              <h3>Your gateway to the online world.</h3>
              <div className='signup'>
                <Image src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/email__1_.png?updatedAt=1682882640230' alt='Email Icon' width={250} height={250}></Image>
                <input
                  placeholder='example@email.com'
                  autoComplete='off'
                  value={emailData.emailTemp}
                  onChange={(event) =>
                    setEmailData({
                      emailTemp: event.target.value,
                    })}
                ></input>
                <Link href={{ pathname: 'signup', query: emailData }}><button>SIGN UP</button></Link>
              </div>
              <div className='support'>
                <button className='download'>
                  <Image src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/shop.png?updatedAt=1681408154217' alt='Shop Icon' width={300} height={300}></Image>
                  Download the app
                </button>
                <a className='learn-more' href='https://github.com/ricardoliveira5ro/Linktree' rel="noopener noreferrer" target="_blank">
                  <span className="circle" aria-hidden="true">
                    <span className="icon arrow"></span>
                  </span>
                  <span className="button-text">Learn More</span>
                </a>
              </div>
            </div>
          </div>
          <div className='phone'>
            <div>
              <Player src="https://assets10.lottiefiles.com/packages/lf20_7ciiygtc.json" background="transparent" loop autoplay></Player>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export function toggleSearch(bool) {
  if (!bool) {
    document.getElementById('search').style.display = 'flex';
    document.getElementById('discover').style.display = 'none';
  } else {
    document.getElementById('search').style.display = 'none';
    document.getElementById('discover').style.display = 'flex';
  }
}