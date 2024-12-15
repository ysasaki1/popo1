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
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", async () => {
    const user = auth.currentUser;

    if (user) {
        document.getElementById('welcomeMessage').innerText = `${user.email}さん、ようこそ！`;
        loadQualifications();
    } else {
        window.location.href = 'index.html'; // 未ログインの場合はログインページにリダイレクト
    }

    document.getElementById('addQualificationButton').addEventListener('click', async () => {
        const qualification = document.getElementById('qualification').value;

        if (qualification) {
            await db.collection('qualifications').add({
                uid: user.uid,
                qualification: qualification,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            document.getElementById('qualification').value = ''; // 入力をクリア
            loadQualifications(); // 更新
        }
    });

    document.getElementById('logoutButton').addEventListener('click', async () => {
        await auth.signOut();
        window.location.href = 'index.html'; // ログインページにリダイレクト
    });
});

async function loadQualifications() {
    const user = auth.currentUser;
    const qualificationList = document.getElementById('qualificationList');
    qualificationList.innerHTML = ''; // 既存のリストをクリア

    const snapshot = await db.collection('qualifications').where('uid', '==', user.uid).get();
    snapshot.forEach(doc => {
        const li = document.createElement('li');
        li.textContent = doc.data().qualification;
        qualificationList.appendChild(li);
    });
}
