import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";

// Firebaseの設定
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
        
        // 資格・受賞歴の追加イベント
        document.getElementById('addQualificationButton').addEventListener('click', async () => {
            const qualification = document.getElementById('qualification').value;

            if (qualification) {
                await addQualification(user.uid, qualification);
                document.getElementById('qualification').value = ''; // 入力をクリア
                await loadQualifications(user.uid); // 更新
            }
        });

        // ログアウト機能
        document.getElementById('logoutButton').addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = 'index.html'; // ログインページにリダイレクト
            } catch (error) {
                console.error("ログアウトに失敗しました: ", error);
                alert("ログアウトに失敗しました。");
            }
        });
    } else {
        window.location.href = 'index.html'; // 未ログインの場合はログインページにリダイレクト
    }
});

// 資格・受賞歴の追加
async function addQualification(uid, qualification) {
    try {
        await addDoc(collection(db, "qualifications"), {
            uid: uid, // ユーザーID
            qualification: qualification, // 資格情報
            createdAt: new Date().toISOString() // 作成日時
        });
        alert("資格・受賞歴が追加されました。");
    } catch (error) {
        console.error("資格の追加に失敗しました: ", error);
    }
}

// 資格・受賞歴のロード
async function loadQualifications(uid) {
    const qualificationList = document.getElementById('qualificationList');
    qualificationList.innerHTML = ''; // リストをクリア

    const q = query(collection(db, "qualifications"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
        const li = document.createElement('li');
        li.textContent = doc.data().qualification;
        qualificationList.appendChild(li);
    });
}
