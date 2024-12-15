import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";

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
const db = getFirestore(app);

// ユーザーの状態を監視
onAuthStateChanged(auth, async (user) => {
    if (user) {
        document.getElementById('welcomeMessage').innerText = `${user.email}さん、ようこそ！`;
        await loadQualifications(user.uid);
        
        // 資格・受賞歴の追加イベント
        document.getElementById('addQualificationButton').addEventListener('click', async () => {
            const qualification = document.getElementById('qualification').value;

            if (!qualification) {
                alert("資格・受賞歴を入力してください。");
                return; // 空の場合は処理を中止
            }

            await addQualification(user.uid, qualification);
            document.getElementById('qualification').value = ''; // 入力をクリア
            await loadQualifications(user.uid); // 更新
        });

        // ログアウト機能
        document.getElementById('logoutButton').addEventListener('click', async () => {
            try {
                await signOut(auth);
                alert("ログアウトしました。");
                window.location.href = 'index.html'; // ログインページにリダイレクト
            } catch (error) {
                console.error("ログアウトに失敗しました: ", error);
                alert("ログアウトに失敗しました。詳細: " + error.message);
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
        await loadQualifications(uid); // 更新
    } catch (error) {
        console.error("資格の追加に失敗しました: ", error);
        alert("資格の追加に失敗しました。詳細: " + error.message);
    }
}

// 資格・受賞歴のロード
async function loadQualifications(uid) {
    const qualificationList = document.getElementById('qualificationList');
    qualificationList.innerHTML = ''; // リストをクリア

    const q = query(collection(db, "qualifications"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    
    const qualifications = [];
    querySnapshot.forEach((doc) => {
        const li = document.createElement('li');
        li.textContent = doc.data().qualification;

        // 削除ボタンを作成
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = async () => {
            await deleteQualification(doc.id); // 資格を削除
        };

        li.appendChild(deleteButton); // リストアイテムに削除ボタンを追加
        qualificationList.appendChild(li);

        // 資格の難易度をサンプルデータとして追加
        qualifications.push(Math.floor(Math.random() * 100)); // ランダムな値を使用（デモ用）
    });

    // 箱ひげ図を描画
    drawBoxPlot(qualifications);
}

// 資格の削除
async function deleteQualification(id) {
    try {
        await deleteDoc(doc(db, "qualifications", id));
        alert("資格・受賞歴が削除されました。");
        const user = getAuth().currentUser; // 現在のユーザーを取得
        await loadQualifications(user.uid); // 更新
    } catch (error) {
        console.error("資格の削除に失敗しました: ", error);
    }
}

// 箱ひげ図を描画
function drawBoxPlot(data) {
    const ctx = document.getElementById('myBoxPlotChart').getContext('2d');
    const myBoxPlotChart = new Chart(ctx, {
        type: 'boxplot',
        data: {
            labels: ['資格の難易度'],
            datasets: [{
                label: '難易度パーセンタイル',
                data: [data], // データを箱ひげ図に渡す
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'パーセンタイル'
                    }
                }
            }
        }
    });
}
