import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from "next/router";
import Head from 'next/head'

import firebase_app from '../../firebase-config'
import { createUserWithEmailAndPassword, getAuth, signOut } from "firebase/auth";

export default function Signup() {
    const [windowHeight, setWindowHeight] = useState(null)
    const emailTemp = useRouter().query.emailTemp;
    const [inputValue, setInputValue] = useState(emailTemp);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const router = useRouter();
    const auth = getAuth(firebase_app);

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight)
        }

        handleResize()

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setEmail(e.target.value)
    };

    const handleForm = async (event) => {
        event.preventDefault()

        var invalid = false;

        resetInvalidMessages();

        if (!validateEmail(email)) {
            invalidEmail();
            invalid = true;
        }

        if (password.length < 6) {
            weakPassword()
            invalid = true;
        }

        if (!matchPasswords(password, confirmPassword)) {
            invalidMatchPasswords()
            invalid = true;
        }

        if (!email) { document.getElementById('spanEmail').textContent = 'Required field' }

        if (!password) {
            emptyPassword()
            invalid = true;
        }
        if (!confirmPassword) {
            emptyConfirmPassword()
            invalid = true;
        }

        if (invalid) { return }

        const { result, error } = await signUp(email, password);

        if (error) {
            return console.log(error)
        }

        return router.push('/')
    }

    const resetInvalidMessages = () => {
        document.getElementById('email').style.border = 'none'
        document.getElementById('spanEmail').style.display = 'none'

        document.getElementById('password').style.border = 'none'
        document.getElementById('spanPassword').style.display = 'none'

        document.getElementById('confirmPassword').style.border = 'none'
        document.getElementById('spanConfirmPassword').style.display = 'none'
    }

    const invalidEmail = () => {
        document.getElementById('email').value = ''
        document.getElementById('spanEmail').style.display = 'flex'
        document.getElementById('email').style.border = '1px solid #dc2626'
        document.getElementById('spanEmail').textContent = 'Invalid email format'
    }

    const weakPassword = () => {
        document.getElementById('password').value = ''
        document.getElementById('password').style.border = '1px solid #dc2626'
        document.getElementById('spanPassword').style.display = 'flex'
        document.getElementById('spanPassword').textContent = 'Passwords should be +6 characters'

        document.getElementById('confirmPassword').value = ''
        document.getElementById('confirmPassword').style.border = '1px solid #dc2626'
        document.getElementById('spanConfirmPassword').style.display = 'flex'
        document.getElementById('spanConfirmPassword').textContent = 'Passwords should be +6 characters'
    }

    const invalidMatchPasswords = () => {
        document.getElementById('password').value = ''
        document.getElementById('password').style.border = '1px solid #dc2626'
        document.getElementById('spanPassword').style.display = 'flex'
        document.getElementById('spanPassword').textContent = 'Passwords should match'

        document.getElementById('confirmPassword').value = ''
        document.getElementById('confirmPassword').style.border = '1px solid #dc2626'
        document.getElementById('spanConfirmPassword').style.display = 'flex'
        document.getElementById('spanConfirmPassword').textContent = 'Passwords should match'

    }

    const emptyPassword = () => {
        document.getElementById('password').value = ''
        document.getElementById('password').style.border = '1px solid #dc2626'
        document.getElementById('spanPassword').style.display = 'flex'
        document.getElementById('spanPassword').textContent = 'Required field'
    }

    const emptyConfirmPassword = () => {
        document.getElementById('confirmPassword').value = ''
        document.getElementById('spanConfirmPassword').style.display = 'flex'
        document.getElementById('spanConfirmPassword').textContent = 'Required field'
        document.getElementById('confirmPassword').style.border = '1px solid #dc2626'
    }

    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const matchPasswords = (password, confirmPassword) => {
        return password === confirmPassword;
    }

    const firebaseErrorHandling = (errorCode) => {
        document.getElementById('email').value = ''
        document.getElementById('email').style.border = '1px solid #dc2626'

        document.getElementById('password').value = ''
        document.getElementById('password').style.border = '1px solid #dc2626'

        document.getElementById('confirmPassword').value = ''
        document.getElementById('confirmPassword').style.border = '1px solid #dc2626'

        switch (errorCode) {
            case 'auth/email-already-in-use':
                document.getElementById('spanEmail').style.display = 'flex'
                document.getElementById('spanEmail').textContent = 'Email already in use'
                break;
        }
    }

    async function signUp(email, password) {
        let result = null,
            error = null;
        try {
            result = await createUserWithEmailAndPassword(auth, email, password);

            //Stop automatically signin after creating user
            signOut(auth)
        } catch (e) {
            error = e;
            firebaseErrorHandling(e.code)
        }
    
        return { result, error };
    }

    return (
        <>
            <Head>
                <title>Linktree</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className="main_signup_login" style={{ minHeight: windowHeight }}>
                <div className="signup_login">
                    <form className='form' id='form' onSubmit={handleForm}>
                        <h1>Create your account</h1>
                        <h3>One link, infinite connections.</h3>
                        <input placeholder='Email' value={inputValue} onChange={handleInputChange} name="email" id="email" autoComplete='off'></input>
                        <span id='spanEmail'>Invalid</span>
                        <input placeholder='Password' onChange={(e) => setPassword(e.target.value)} name="password" id="password" type="password" autoComplete='off'></input>
                        <span id='spanPassword'>Invalid</span>
                        <input placeholder='Confirm Password' onChange={(e) => setConfirmPassword(e.target.value)} name="confirmPassword" id="confirmPassword" type="password" autoComplete='off'></input>
                        <span id='spanConfirmPassword'>Invalid</span>
                        <button id='signup_btn' type="submit">Sign Up</button>
                        <p>Already have an account? <Link href='/login'>Log In</Link></p>
                    </form>
                </div>
                <div className="banner">
                    <Image src='https://ik.imagekit.io/ricardo5ro/Linktree/general/signup.jpg?updatedAt=1683627571722' alt='Side banner' width={windowHeight / 1.5} height={windowHeight * 1}></Image>
                </div>
            </div>
        </>
    )
}