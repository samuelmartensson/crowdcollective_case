import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0SR-VVkT-xXWWkL2_DBYyjuAYbXO95nM",
  authDomain: "auth-api-731e8.firebaseapp.com",
  databaseURL:
    "https://auth-api-731e8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "auth-api-731e8",
  storageBucket: "auth-api-731e8.appspot.com",
  messagingSenderId: "785483456080",
  appId: "1:785483456080:web:0fae4a7f43549651657b55",
  measurementId: "G-VZ7EKP42DH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
