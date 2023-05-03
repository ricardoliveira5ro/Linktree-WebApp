import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useState, useEffect, useRef } from 'react'
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [windowHeight, setWindowHeight] = useState(null)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo_icon.png" />
        <Script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></Script>
      </Head>
      <main className='background' style={{ minHeight: windowHeight }}>
        <div className='header'>
          <img className='logo' src='https://ik.imagekit.io/ricardo5ro/Linktree/logo/linktree_black.png?updatedAt=1681143068053'></img>
          <img className='logo_icon' src='https://ik.imagekit.io/ricardo5ro/Linktree/logo/icon_Fy3Lvr137?updatedAt=1683017622032'></img>
          <ul className='menu'>
            <a href=''><li className='menu1'>Home</li></a>
            <li className='menu2'>|</li>
            <a id='discover' onClick={() => toggleSearch(false)}><li className='menu3'>Discover</li></a>
            <li id='search' className='search' ref={searchRef}>
              <a href=''><img src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/search__1_.png?updatedAt=1681465571645'></img></a>
              <input placeholder='Type something' autoComplete='off'></input>
            </li>
          </ul>
          <div className='accountDiv'>
            <div className='miniSearch'>
              <a href=''><img src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/search__1_.png?updatedAt=1681465571645'></img></a>
              <input placeholder='Type something' autoComplete='off'></input>
            </div>
            <a className='profileIcon' href=''><img src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/profile-user.png?updatedAt=1682980525659'></img></a>
            <button>MY ACCOUNT</button>
          </div>
        </div>
        <div className='main'>
          <div className='content'>
            <div>
              <h1 className='animate__animated animate__pulse animate__infinite'>Link once, share everywhere.</h1>
              <h3>Your gateway to the online world.</h3>
              <div className='signup'>
                <img src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/email__1_.png?updatedAt=1682882640230'></img>
                <input placeholder='example@email.com' autoComplete='off'></input>
                <button>SIGN UP</button>
              </div>
              <div className='support'>
                <button className='download'>
                  <img src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/shop.png?updatedAt=1681408154217'></img>
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