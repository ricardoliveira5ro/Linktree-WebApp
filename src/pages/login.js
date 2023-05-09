import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Login() {
    const [windowHeight, setWindowHeight] = useState(null)

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight)
        }

        handleResize()

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <>
            <div className="main_signup_login" style={{ minHeight: windowHeight }}>
                <div className="signup_login">
                <form className='form'>
                        <h1>Log in to your account</h1>
                        <h3>Your personalized link hub awaits</h3>
                        <input placeholder='Email' autoComplete='off'></input>
                        <input placeholder='Password' autoComplete='off'></input>
                        <label><a>Forgot password?</a></label>
                        <button id='login_btn'>Log In</button>
                        <p>Don&apos;t have an account? <Link href='/signup'>Sign up</Link></p>
                    </form>
                </div>
                <div className="banner">
                    <Image src='https://ik.imagekit.io/ricardo5ro/Linktree/general/login.jpg?updatedAt=1683627554047' alt='Side banner' width={windowHeight/1.5} height={windowHeight*1}></Image>
                </div>
            </div>
        </>
    )
}