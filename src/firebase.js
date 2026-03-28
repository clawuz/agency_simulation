import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAElbfMonwh9W_VKRZZ4jTsqGczYUQOa9o',
  authDomain: 'agency-planing.firebaseapp.com',
  projectId: 'agency-planing',
  storageBucket: 'agency-planing.firebasestorage.app',
  messagingSenderId: '933162635662',
  appId: '1:933162635662:web:0a2da782bab9821b3614df',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
