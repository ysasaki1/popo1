import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebaseの初期化
const firebaseConfig = {
    apiKey: "AIzaSyCEDnTkokqJkA2a2Av80EUhgjvWgdFkZyM",
    authDomain: "popo1-e5216.firebaseapp.com",
    projectId: "popo1-e5216",
    storageBucket: "popo1-e5216.appspot.com",
    messagingSenderId: "623743254259",
    appId: "1:623743254259:web:a538e7dc230a7d59e60186",
    measurementId: "G-1B4008JG5P"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ユーザーの状態を監視
onAuthStateChanged(auth, async (user) => {
    if (user) {
        document.getElementById('welcomeMessage').innerText = `${user.email}さん、ようこそ！`;
        await loadQualifications(user.uid);
    } else {
        window.location.href = 'index.html'; // 未ログインの場合はログインページにリダイレクト
    }
});

// 資格・受賞歴の追加
document.getElementById('addQualificationButton').addEventListener('click', async () => {
    const qualification = document.getElement
