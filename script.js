// Firebaseの初期化
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebaseの設定
const firebaseConfig = {
    apiKey: "AIzaSyCEDnTtokqJkA2a2Av80EUhgjvWgdFkZyM",
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

// ユーザー登録
document.getElementById('registerButton').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('ユーザー登録成功');
        window.location.href = 'user.html'; // ユーザーページにリダイレクト
    } catch (error) {
        showError(error.message);
    }
});

// ログイン
document.getElementById('loginButton').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'user.html'; // ユーザーページにリダイレクト
    } catch (error) {
        showError(error.message);
    }
});

// エラーメッセージの表示
function showError(message) {
    document.getElementById('modalMessage').innerText = message;
    document.getElementById('errorModal').style.display = 'block';
}

document.getElementById('closeModal').onclick = function() {
    document.getElementById('errorModal').style.display = 'none';
}
