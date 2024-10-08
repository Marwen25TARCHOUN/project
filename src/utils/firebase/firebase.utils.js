import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, writeBatch, query, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWvRm4MwPmnY-AUSfuAFSBZxV3l76pcVk",
  authDomain: "crwn-clothing-db-adabb.firebaseapp.com",
  projectId: "crwn-clothing-db-adabb",
  storageBucket: "crwn-clothing-db-adabb.appspot.com",
  messagingSenderId: "81840743750",
  appId: "1:81840743750:web:48985f20d44c6fc6ff7147"
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();

export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const addCollectionAndDocument = async (collectionKey, objectsToAdd, field) => {
  const collectionRef = collection(db, collectionKey);

  const batch = writeBatch(db)

  objectsToAdd.forEach(element => {
    const docRef = doc(collectionRef, element[field].toLowerCase());
    batch.set(docRef, element);
  });

  await batch.commit();

  console.log('DONE');
}

export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, 'categories');
  const q = query(collectionRef);
  const querySnapShot = await getDocs(q);

  return querySnapShot.docs.map(docSnapShot =>  docSnapShot.data())

  // const categoryMap = querySnapShot.docs.reduce((acc, docSnapShot) => {
  //   const { title, items } = docSnapShot.data();

  //   acc[title.toLowerCase()] = items;

  //   return acc;
  // }, {})

  // return categoryMap;
}

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }

  return userSnapshot;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, 
      (userAuth) => {
        unsubscribe();
        resolve(userAuth);
      }, 
      reject
    );
  })
}