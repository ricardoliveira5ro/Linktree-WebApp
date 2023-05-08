import { useState, useEffect } from 'react'

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
                        <p>Don&apos;t have an account? <a>Sign up</a></p>
                    </form>
                </div>
                <div className="banner">
                    <img src='https://ik.imagekit.io/ricardo5ro/Linktree/general/pexels-sound-on-3756879.jpg?updatedAt=1683557801324' style={{ maxHeight: windowHeight }}></img>
                </div>
            </div>
        </>
    )
}