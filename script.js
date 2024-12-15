// Firebaseの初期化
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

document.getElementById('registerButton').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await auth.createUserWithEmailAndPassword(email, password);
        alert('ユーザー登録成功');
    } catch (error) {
        showError(error.message);
    }
});

document.getElementById('loginButton').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert('ログイン成功');
    } catch (error) {
        showError(error.message);
    }
});

function showError(message) {
    document.getElementById('modalMessage').innerText = message;
    document.getElementById('errorModal').style.display = 'block';
}

document.getElementById('closeModal').onclick = function() {
    document.getElementById('errorModal').style.display = 'none';
}
