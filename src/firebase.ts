import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
    apiKey: 'AIzaSyAIKpgJB1r0evh92Qe7XynV7Z8jc9wOCL8',
    authDomain: 'messenger-43941.firebaseapp.com',
    projectId: 'messenger-43941',
    storageBucket: 'messenger-43941.appspot.com',
    messagingSenderId: '268910131837',
    appId: '1:268910131837:web:78c2d05d9ef5aa07df4f14',
    databaseURL: "https://messenger-43941-default-rtdb.europe-west1.firebasedatabase.app/",
};


export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app);