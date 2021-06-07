import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyBbnovg4p20GuVsDOkgr-oNIVPZDIKuy94",
    authDomain: "infinitysystems-20847.firebaseapp.com",
    projectId: "infinitysystems-20847",
    storageBucket: "infinitysystems-20847.appspot.com",
    messagingSenderId: "699901568079",
    appId: "1:699901568079:web:7daa6d0253ff9a3bd7763a"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore()
  const auth =firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export {auth, provider};
  export default db;