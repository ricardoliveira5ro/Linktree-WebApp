import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import firebase_app from '../../firebase-config'
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, get, ref, child, set, push, update } from 'firebase/database'

export default function Account() {
    const [windowHeight, setWindowHeight] = useState(null)
    const [selectedOption, setSelectedOption] = useState(null);
    const [imageSrcProfile, setimageSrcProfile] = useState('https://ik.imagekit.io/ricardo5ro/Linktree/icons/user.png?updatedAt=1684087499218');
    const [snapshotData, setSnapshotData] = useState([])
    const [firstName, setFirstName] = useState(snapshotData.firstName || '')
    const [lastName, setLastName] = useState('')
    const [numLinks, setNumLinks] = useState(1)
    const [connections, setConnections] = useState([])
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [editedIndex, setEditedIndex] = useState(-1)
    const [editedUrl, setEditedUrl] = useState('')
    const [editedTitle, setEditedTitle] = useState('')
    const router = useRouter();
    const auth = getAuth(firebase_app);
    const db = getDatabase();

    //Window size
    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight)
        }

        handleResize()

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    //Check authorized access
    useEffect(() => {
        const checkAuthentication = () => {
            const user = auth.currentUser;
            if (!user)
                router.push('/login');
        };

        checkAuthentication();
    }, [router, auth.currentUser]);

    //Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = auth.currentUser

                if (user) {
                    const snapshot = await get(child(ref(db), `users/${user.uid}`));

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

                        setFirstName(firstName)
                        setLastName(lastName)

                        const items = snapshot.val().links;
                        if (items) {
                            const dataArray = Object.entries(items).map(([id, item]) => ({ id, ...item }));
                            setConnections(dataArray)
                        }

                        setNumLinks(items ? items.length - 1 : 0)
                    }
                }

            } catch (error) {
                // Handle error
            }
        }

        fetchData()
    }, [auth.currentUser, db]);

    const addOrCloseConnection = (add) => {
        console.log(numLinks)
        var els = document.getElementsByClassName('hiddenConnections');

        Array.prototype.forEach.call(els, function (el) {
            add ? el.style.display = 'none' : el.style.display = 'flex'
        });

        var addConnection = document.getElementById('addConnection')
        add ? addConnection.style.display = 'flex' : addConnection.style.display = 'none'

        document.getElementById('url').value = ''
        document.getElementById('title').value = ''
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

    const saveConnection = () => {
        var tempConnection = { url: url, title: title }
        const newConnections = [...connections, tempConnection];
        connections.push(tempConnection)

        update(ref(db, 'users/' + auth.currentUser.uid), {
            links: connections
        })

        setConnections(newConnections);
        setNumLinks(numLinks + 1);
        addOrCloseConnection(false)
    }

    const deleteConnection = (index) => {
        const tempConnections = [...connections]
        tempConnections.splice(index + 1, 1)

        update(ref(db, 'users/' + auth.currentUser.uid), {
            links: tempConnections
        })

        setNumLinks(numLinks - 1);
        setConnections(tempConnections);
    }

    const openOrCloseEditConnection = (open, index) => {
        setEditedIndex(index + 1)

        var els = document.getElementsByClassName('hiddenConnections');

        Array.prototype.forEach.call(els, function (el) {
            open ? el.style.display = 'none' : el.style.display = 'flex'
        });

        var editConnection = document.getElementById('editConnection')
        open ? editConnection.style.display = 'flex' : editConnection.style.display = 'none'

        //Open edit mode
        if (index != -1) {
            var connection = connections[index + 1]

            document.getElementById('editedUrl').value = connection.url
            document.getElementById('editedTitle').value = connection.title
        }
    }

    const updateConnection = () => {
        const updatedConnections = [...connections];

        updatedConnections[editedIndex] = {
            title: editedTitle,
            url: editedUrl,
        }

        update(ref(db, 'users/' + auth.currentUser.uid), {
            links: updatedConnections
        })

        setConnections(updatedConnections);
        openOrCloseEditConnection(false, -1);
    }

    const saveInfo = (event) => {
        event.preventDefault()

        update(ref(db, 'users/' + auth.currentUser.uid), {
            firstName: firstName || '',
            lastName: lastName || '',
            gender: selectedOption
        })

        window.location.reload();
    }

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
                        <div className='account_link_section hiddenConnections' key={index}>
                            <button className='account_link' onClick={() => openOrCloseEditConnection(true, index)}>
                                <span>{item.title}</span>
                            </button>
                            <Image className='max-w-[32px] ml-2' onClick={() => deleteConnection(index)} src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/delete.png?updatedAt=1684763829463' width={500} height={500} alt='Add icon'></Image>
                        </div>
                    ))}
                    <div className='account_connection' id='editConnection'>
                        <div className='account_connection_top'>
                            <input className='account_inputUrl account_input_connection' placeholder='Your URL' name='editedUrl' id='editedUrl' onChange={(e) => setEditedUrl(e.target.value)} autoComplete='off' maxLength={50}></input>
                        </div>
                        <div className='account_connection_bottom'>
                            <input className='w-full account_input_connection' placeholder='Title' name='editedTitle' id='editedTitle' onChange={(e) => setEditedTitle(e.target.value)} autoComplete='off' maxLength={12}></input>
                            <div className='flex items-center'>
                                <button onClick={updateConnection} className='mx-2'><Image className='account_connection_submit' src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/checked.png?updatedAt=1684143314120' width={500} height={500} alt='Submit'></Image></button>
                                <button onClick={() => openOrCloseEditConnection(false, -1)}><Image className='account_connection_submit' src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/cross.png?updatedAt=1684143314655' width={500} height={500} alt='Submit'></Image></button>
                            </div>
                        </div>
                    </div>


                    {numLinks < 7 &&
                        <button className='account_link backgroundstripe hiddenConnections' onClick={() => addOrCloseConnection(true)}>
                            <Image className='account_addIcon' src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/plus.png?updatedAt=1684095913516' width={500} height={500} alt='Add icon'></Image>
                            <span>Add Connection</span>
                        </button>
                    }
                    <div className='account_connection' id='addConnection'>
                        <div className='account_connection_top'>
                            <input className='account_inputUrl account_input_connection' placeholder='Your URL' name='url' id='url' onChange={(e) => setUrl(e.target.value)} autoComplete='off' maxLength={50}></input>
                        </div>
                        <div className='account_connection_bottom'>
                            <input className='w-full account_input_connection' placeholder='Title' name='title' id='title' onChange={(e) => setTitle(e.target.value)} autoComplete='off' maxLength={12}></input>
                            <div className='flex items-center'>
                                <button onClick={saveConnection} className='mx-2'><Image className='account_connection_submit' src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/checked.png?updatedAt=1684143314120' width={500} height={500} alt='Submit'></Image></button>
                                <button onClick={() => addOrCloseConnection(false)}><Image className='account_connection_submit' src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/cross.png?updatedAt=1684143314655' width={500} height={500} alt='Submit'></Image></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='account_info'>
                    <div className='account_topInfo'>
                        <Link href='/' className='account_home'>
                            <Image className='max-w-[35px]' src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/home-button.png?updatedAt=1684166408561' width={500} height={500} alt='Home button'></Image>
                            <span>Home</span>
                        </Link>
                        <Link href='/' className='account_signout' onClick={signOutAndLeave}>
                            <span>Sign Out</span>
                            <Image className='max-w-[35px]' src='https://ik.imagekit.io/ricardo5ro/Linktree/icons/logout.png?updatedAt=1684351982022' width={500} height={500} alt='Signout button'></Image>
                        </Link>
                    </div>


                    <h1 className='account_title'>Personal Information</h1>
                    <form className='account_form' onSubmit={saveInfo}>
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
                                <button>
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