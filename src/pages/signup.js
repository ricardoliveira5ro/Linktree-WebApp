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
            <div className="main_login" style={{ minHeight: windowHeight }}>
                <div className="login">
                    <form className='form_login'>
                        <h1>Create your account</h1>
                        <h3>One link, infinite connections.</h3>
                        <input placeholder='Email' autoComplete='off'></input>
                        <input placeholder='Password' autoComplete='off'></input>
                        <input placeholder='Confirm Password' autoComplete='off'></input>
                        <button>Sign Up</button>
                        <p>Already have an account? <a>Log In</a></p>
                    </form>
                </div>
                <div className="banner">
                    <img src='https://ik.imagekit.io/ricardo5ro/Linktree/general/pexels-victoria-strelkaph-11034413.jpg?updatedAt=1683557801842' style={{ maxHeight: windowHeight }}></img>
                </div>
            </div>
        </>
    )
}