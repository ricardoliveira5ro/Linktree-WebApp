import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Signup() {
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
                        <h1>Create your account</h1>
                        <h3>One link, infinite connections.</h3>
                        <input placeholder='Email' autoComplete='off'></input>
                        <input placeholder='Password' autoComplete='off'></input>
                        <input placeholder='Confirm Password' autoComplete='off'></input>
                        <button id='signup_btn'>Sign Up</button>
                        <p>Already have an account? <Link href='/login'>Log In</Link></p>
                    </form>
                </div>
                <div className="banner">
                    <Image src='https://ik.imagekit.io/ricardo5ro/Linktree/general/signup.jpg?updatedAt=1683627571722' alt='Side banner' width={windowHeight/1.5} height={windowHeight*1}></Image>
                </div>
            </div>
        </>
    )
}