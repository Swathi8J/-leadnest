import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDK1c14Mg9dLQVD_BzI8TJJEVMYqgmmC20',
  authDomain: 'leadnest-f0edf.firebaseapp.com',
  projectId: 'leadnest-f0edf',
  storageBucket: 'leadnest-f0edf.firebasestorage.app',
  messagingSenderId: '717205709033',
  appId: '1:717205709033:web:dd69b17b8bfd1752365078',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);