import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBkkFF0XhNZeWuDmOfEhsgdfX1VBG7WTas",
  authDomain: "theroots-chat.firebaseapp.com",
  projectId: "theroots-chat",
  storageBucket: "theroots-chat.appspot.com",
  messagingSenderId: "657483921",
  appId: "1:657483921:web:def456abc789",
  databaseURL: "https://theroots-chat-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);