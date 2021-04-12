import fb from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/database';

export const firebaseConfig: any = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    databaseURL: process.env.FIREBASE_DATABASEURL,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
    appId: process.env.FIREBASE_APPID,
    measurementId: process.env.FIREBASE_MEASUREMENTID
};



export const firebaseDb = !fb.apps.length ? fb.initializeApp(firebaseConfig) : fb.app();
export const firestoreDb = firebaseDb.firestore();
export const realtimeDb = firebaseDb.database(); 