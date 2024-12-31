/* eslint-disable no-unused-vars */ // To suppress warnings for unused variables if necessary

import { onDocumentCreated } from 'firebase-functions/v2/firestore'; // Firebase Firestore function
import { initializeApp, getFirestore } from 'firebase-admin'; // Firebase Admin SDK
import Filter from 'bad-words'; // Import bad-words library

// Initialize Firebase Admin
initializeApp();

// Firestore database instance
const db = getFirestore();

export const detectEvilUsers = onDocumentCreated('messages/{msgId}', async (event) => {
  const filter = new Filter();
  const { text, uid } = event.data; // Fetch data from the document

  if (filter.isProfane(text)) {
    const cleaned = filter.clean(text); // Clean the profane text

    // Update the message with a warning
    await event.data.ref.update({ text: 'I got Banned for illicit behaviour' });

    // Add the user to the 'banned' collection
    await db.collection('banned').doc(uid).set({});
  }
});
