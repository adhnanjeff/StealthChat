Make sure you have this in your rules of Cloud Firestore

<!-- rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // This rule allows anyone with your Firestore database reference to view, edit,
    // and delete all data in your Firestore database. It is useful for getting
    // started, but it is configured to expire after 30 days because it
    // leaves your app open to attackers. At that time, all client
    // requests to your Firestore database will be denied.
    //
    // Make sure to write security rules for your app before that time, or else
    // all client requests to your Firestore database will be denied until you Update
    // your rules
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 1, 30);
    }
    match /messages/{docId}{
    	allow read: if request.auth.uid != null;
      allow create: if canCreateMessage();
    }
    function canCreateMessage(){
    	let isSignedIn = request.auth.uid != null;
      let isOwner = request.auth.uid == request.resource.data.uid;
      let isNotBanned = exists(
      	/databases/$(database)/documents/banned/$(request.auth.uid)) == false;
      return isSignedIn && isOwner && isNotBanned;
    }
  }
} -->