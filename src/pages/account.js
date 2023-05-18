import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import { useState, useEffect } from 'react'

import firebase_app from '../../firebase-config'
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { getDatabase, get, ref, child } from 'firebase/database'

export default function Account() {
    const [windowHeight, setWindowHeight] = useState(null)
    const [selectedOption, setSelectedOption] = useState(null);
    const [imageSrcProfile, setimageSrcProfile] = useState('https://ik.imagekit.io/ricardo5ro/Linktree/icons/user.png?updatedAt=1684087499218');
    const [snapshotData, setSnapshotData] = useState([])
    const [firstName, setFirstName] = useState(snapshotData.firstName || '')
    const [lastName, setLastName] = useState('')
    const [numLinks, setNumLinks] = useState(1)
    const [connections, setConnections] = useState([])

    const auth = getAuth(firebase_app);
    const router = useRouter();
    const db = getDatabase();

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight)
        }

        handleResize()

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snapshot = await get(child(ref(db), `users/${auth.currentUser.uid}`));

                if (snapshot.exists()) {
                    setSnapshotData(snapshot.val())

                    const gender = snapshot.val().gender;
                    setSelectedOption(gender);
                    if (gender === 'female') {
                        setimageSrcProfile('https://ik.imagekit.io/ricardo5ro/Linktree/icons/woman.png?updatedAt=1684161997979');
                    } else {
                        setimageSrcProfile('https://ik.imagekit.io/ricardo5ro/Linktree/icons/user.png?updatedAt=1684087499218');
                    }

                    const firstName = snapshot.val().firstName
                    const lastName = snapshot.val().lastName
                    document.getElementById('firstName').value = firstName
                    document.getElementById('lastName').value = lastName

                    const items = snapshot.val().links;
                    if (items) {
                        const dataArray = Object.entries(items).map(([id, item]) => ({ id, ...item }));
                        setConnections(dataArray)
                    }

                    setNumLinks(items.length - 1)
                }
            } catch (error) {
                // Handle error
            }
        }

        fetchData()
    }, [])

    const addOrCloseConnection = (add) => {
        var els = document.getElementsByClassName('hiddenConnections');

        Array.prototype.forEach.call(els, function (el) {
            add ? el.style.display = 'none' : el.style.display = 'flex'
        });

        var addConnection = document.getElementById('addConnection')
        add ? addConnection.style.display = 'flex' : addConnection.style.display = 'none'
    }

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        if (event.target.value == 'male')
            setimageSrcProfile('https://ik.imagekit.io/ricardo5ro/Linktree/icons/user.png?updatedAt=1684087499218')
        else if (event.target.value == 'female')
            setimageSrcProfile('https://ik.imagekit.io/ricardo5ro/Linktree/icons/woman.png?updatedAt=1684161997979')
    };

    const signOutAndLeave = () => {
        signOut(auth);
    };

    return (
        <>
            <Head>
                <title>Linktree</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className='main_account' style={{ minHeight: windowHeight }}>
                <div className='phone_model'>
                    <Image src={imageSrcProfile} width={500} height={500} alt='User photo' className='account_profileImg'></Image>
                    <span className='username'>@ricardo5ro</span>
                    {connections.length > 1 && connections.slice(1).map((item, index) => (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className='account_link hiddenConnections' key={index}>
                            <span>{item.title}</span>
                        </a>
                    ))}
                    {numLinks < 7 &&
                        <button className='account_link backgroundstripe hiddenConnections' onClick={() => addOrCloseConnection(true)}>
                            <Image className='account_addIcon' src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/plus.png?updatedAt=1684095913516' width={500} height={500} alt='Add icon'></Image>
                            <span>Add Connection</span>
                        </button>
                    }
                    <div className='account_connection' id='addConnection'>
                        <div className='account_connection_top'>
                            <input className='account_inputUrl account_input_connection' placeholder='Your URL' autoComplete='off' maxLength={50}></input>
                        </div>
                        <div className='account_connection_bottom'>
                            <input className='w-full account_input_connection' placeholder='Title' autoComplete='off' maxLength={12}></input>
                            <div className='flex items-center'>
                                <button className='mx-2'><Image className='account_connection_submit' src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/checked.png?updatedAt=1684143314120' width={500} height={500} alt='Submit'></Image></button>
                                <button onClick={() => addOrCloseConnection(false)}><Image className='account_connection_submit' src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/cross.png?updatedAt=1684143314655' width={500} height={500} alt='Submit'></Image></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='account_info'>
                    <div className='account_topInfo'>
                        <Link href='/' className='account_home' onClick={signOutAndLeave}>
                            <Image className='max-w-[35px]' src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/home-button.png?updatedAt=1684166408561' width={500} height={500} alt='Home button'></Image>
                            <span>Home</span>
                        </Link>
                        <Link href='/' className='account_signout'>
                            <span>Sign Out</span>
                            <Image className='max-w-[35px]' src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/logout.png?updatedAt=1684351982022' width={500} height={500} alt='Signout button'></Image>
                        </Link>
                    </div>
                    <h1 className='account_title'>Personal Information</h1>
                    <form className='account_form'>
                        <div className='account_names'>
                            <input className='account_usernameInput mr-4' placeholder='First Name' name='firstName' id='firstName' onChange={(e) => setFirstName(e.target.value)} autoComplete='off'></input>
                            <input className='account_usernameInput' placeholder='Last Name' name='lastName' id='lastName' onChange={(e) => setLastName(e.target.value)} autoComplete='off'></input>
                        </div>
                        <span id='account_email'>{snapshotData.email}</span>
                        <div className='account_bottom'>
                            <div className='account_gender'>
                                <h3>What is your gender?</h3>
                                <div className='account_radioButtons'>
                                    <label className='mr-3 '>
                                        <input
                                            id='male'
                                            type="radio"
                                            value="male"
                                            checked={selectedOption === 'male'}
                                            onChange={handleOptionChange}
                                        />
                                        <Image className='max-w-[50px]' src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/male.png?updatedAt=1684158603564' width={500} height={500} alt='Male choice'></Image>
                                    </label>
                                    <label>
                                        <input
                                            id='female'
                                            type="radio"
                                            value="female"
                                            checked={selectedOption === 'female'}
                                            onChange={handleOptionChange}
                                        />
                                        <Image className='max-w-[50px]' src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/female-symbol.png?updatedAt=1684158603471' width={500} height={500} alt='Male choice'></Image>
                                    </label>
                                </div>
                            </div>
                            <div className='account_submit'>
                                <button type='submit'>
                                    <span>Save</span>
                                    <Image className='max-w-[25px]' src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/accept.png?updatedAt=1684165588471' width={500} height={500} alt='Submit button'></Image>
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}