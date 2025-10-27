// Impor fungsi yang Anda perlukan dari SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// TODO: PASTE KONFIGURASI FIREBASE ANDA DI SINI
// Ini adalah objek yang Anda salin dari Langkah 1
const firebaseConfig = {
  apiKey: "AIzaSy...ANDA...",
  authDomain: "proyek-anda.firebaseapp.com",
  projectId: "proyek-anda",
  storageBucket: "proyek-anda.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefg"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor layanan yang akan digunakan di file lain
export const auth = getAuth(app);
export const db = getFirestore(app);