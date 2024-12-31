import React, { useRef, useState } from 'react'
import './App.css'

import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { signInWithPopup } from 'firebase/auth';

firebase.initializeApp({
  //your configurations
})

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Use the already-initialized app
}
export const auth = firebase.auth();
const firestore = firebase.firestore()

function App() {
  // Returns an userID email add and other details otherwise NULL
  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header>

      </header>
      <section>
        {/* Checks if user has already signedIn if yes displays the chatroom else displays the signIn button */}
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    // Button to sign in using Google AuthProvider
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  );
}


function SignOut() {
  return auth.currentUser && (
    // Button to sign out the current user
    <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}


function ChatRoom() {
  const dummy = useRef()
  // Fetch messages from Firestore and render them
  const messageRef = firestore.collection('messages')
  const query = messageRef.orderBy('createdAt').limit(25)

  // Returns an array of objects in which each object is a chatmsg in the database
  const [messages] = useCollectionData(query, {idField: 'id'})

  const [formValue, setFormValue] = useState('')

  const sendMessage = async(e) => {
    // This prevents the page to refresh when the form is submitted
    e.preventDefault()
    // User id and photo of currently loggedIn user is fetched
    const { uid, photoURL } = auth.currentUser
    // A new document is created in Firestore with the current timestamp and the formValue
    await messageRef.add({
      text: formValue,
      createdAt : firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    })
    setFormValue('')
    // This scrolls down the page to the bottom
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }

  // Code to render messages goes here
  return (
    <>
      <main>
        <SignOut />
        {messages ? (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        ) : (
          <p>Loading messages...</p>
        )}
        {/* This below div is inorder to scroll the page automatically to the bottom 
        when an user enters into the chatroom*/}
        <div ref={dummy}>

        </div>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        <button type='submit'>Send</button>
      </form>
    </>
  )
}

function ChatMessage(props){
  const { text, uid, photoURL } = props.message;
  // Displays sent if uid of user and current user matches else displays received
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/40/default.png'} alt="Avatar" />
      <p>{text}</p>
    </div>
  );
}

export default App
