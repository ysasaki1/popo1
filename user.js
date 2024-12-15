import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";

// Firebaseの設定
const firebaseConfig = {
    apiKey: "AIzaSyB1_49HKdussy1p5Yq1mtRiFCf9YMnwmOU",
    authDomain: "po09-91f80.firebaseapp.com",
    projectId: "po09-91f80",
    storageBucket: "po09-91f80.firebasestorage.app",
    messagingSenderId: "116376226644",
    appId: "1:116376226644:web:cee3eacc0837872caf16c1",
    measurementId: "G-2JWQBBBRML"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ページがロードされたときにユーザーの認証状態を確認
window.addEventListener('load', () => {
    checkUserAuth();
});

// ユーザーの認証状態を確認する関数
function checkUserAuth() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById('welcomeMessage').innerText = `${user.email}さん、ようこそ！`;
            loadCertifications(user.uid);
        } else {
            window.location.href = 'index.html';
        }
    });
}

// 資格・受賞歴の追加イベント
document.getElementById('addQualificationButton').addEventListener('click', async () => {
    const qualification = document.getElementById('qualification').value;
    const difficulty = parseInt(document.getElementById('difficulty').value);
    const user = auth.currentUser;

    if (!qualification || isNaN(difficulty)) {
        alert("資格・受賞歴と難易度を入力してください。");
        return;
    }

    await addCertification(user.uid, qualification, difficulty);
    document.getElementById('qualification').value = '';
    document.getElementById('difficulty').value = '';
    await loadCertifications(user.uid);
});

// ログアウト機能
document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        await signOut(auth);
        alert("ログアウトしました。");
        window.location.href = 'index.html';
    } catch (error) {
        console.error("ログアウトに失敗しました: ", error);
        alert("ログアウトに失敗しました。詳細: " + error.message);
    }
});

// 資格・受賞歴の追加
async function addCertification(uid, qualification, difficulty) {
    try {
        await addDoc(collection(db, "certifications"), {
            uid: uid,
            qualification: qualification,
            difficulty: difficulty,
            createdAt: new Date().toISOString()
        });
        alert("資格・受賞歴が追加されました。");
        await loadCertifications(uid);
    } catch (error) {
        console.error("資格の追加に失敗しました: ", error);
        alert("資格の追加に失敗しました。詳細: " + error.message);
    }
}

// 資格・受賞歴のロード
async function loadCertifications(uid) {
    const certificationList = document.getElementById('qualificationList');
    certificationList.innerHTML = '';

    const q = query(collection(db, "certifications"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement('li');
        li.className = 'qualification-item'; // クラスを追加

        const qualificationText = document.createElement('span');
        qualificationText.className = 'qualification-text'; // 資格テキスト用のクラスを追加
        qualificationText.textContent = `${data.qualification}`; // 資格名を表示

        const stars = document.createElement('span');
        stars.className = 'star-rating'; // 星表記用のクラスを追加
        stars.innerHTML = getStarRating(data.difficulty); // 星表記を追加

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = async () => {
            await deleteCertification(doc.id);
        };

        // 資格名、難易度、削除ボタンを追加
        li.appendChild(qualificationText);
        li.appendChild(stars); // 星表記を追加
        li.appendChild(deleteButton); // 削除ボタンを追加

        certificationList.appendChild(li);
    });
}

// 資格の削除
async function deleteCertification(id) {
    try {
        await deleteDoc(doc(db, "certifications", id));
        alert("資格・受賞歴が削除されました。");
        const user = auth.currentUser;
        await loadCertifications(user.uid);
    } catch (error) {
        console.error("資格の削除に失敗しました: ", error);
    }
}

// 星表記を生成する関数
function getStarRating(difficulty) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= difficulty) {
            stars += '★'; // 塗りつぶしの星
        } else {
            stars += '☆'; // 輪郭の星
        }
    }
    return stars;
}
