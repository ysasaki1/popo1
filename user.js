import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { Chart } from "https://cdn.jsdelivr.net/npm/chart.js"; // Chart.jsをインポート

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

// グローバル変数としてチャートを定義
let myBarChart;

// ページがロードされたときにユーザーの認証状態を確認
window.addEventListener('load', () => {
    checkUserAuth();
});

// ユーザーの認証状態を確認する関数
function checkUserAuth() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById('welcomeMessage').innerText = `${user.email}さん、ようこそ！`;
            loadQualifications(user.uid);
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

    await addQualification(user.uid, qualification, difficulty);
    document.getElementById('qualification').value = '';
    document.getElementById('difficulty').value = '';
    await loadQualifications(user.uid);
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
async function addQualification(uid, qualification, difficulty) {
    try {
        await addDoc(collection(db, "qualifications"), {
            uid: uid,
            qualification: qualification,
            difficulty: difficulty,
            createdAt: new Date().toISOString()
        });
        alert("資格・受賞歴が追加されました。");
        await loadQualifications(uid);
    } catch (error) {
        console.error("資格の追加に失敗しました: ", error);
        alert("資格の追加に失敗しました。詳細: " + error.message);
    }
}

// 資格・受賞歴のロード
async function loadQualifications(uid) {
    const qualificationList = document.getElementById('qualificationList');
    qualificationList.innerHTML = '';

    const q = query(collection(db, "qualifications"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    
    const difficulties = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement('li');
        li.textContent = `${data.qualification} (難易度: ${data.difficulty})`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = async () => {
            await deleteQualification(doc.id);
        };

        li.appendChild(deleteButton);
        qualificationList.appendChild(li);

        difficulties.push(data.difficulty);
    });

    drawBarChart(difficulties); // 難易度の配列を渡す
}

// 資格の削除
async function deleteQualification(id) {
    try {
        await deleteDoc(doc(db, "qualifications", id));
        alert("資格・受賞歴が削除されました。");
        const user = auth.currentUser;
        await loadQualifications(user.uid);
    } catch (error) {
        console.error("資格の削除に失敗しました: ", error);
    }
}

// 棒グラフを描画
function drawBarChart(data) {
    const ctx = document.getElementById('myBarChart').getContext('2d');

    // 既存のチャートがある場合は破棄する
    if (myBarChart) {
        myBarChart.destroy();
    }

    // データが空でない場合のみ描画
    if (data.length > 0) {
        const percentiles = [
            percentile(data, 25),
            percentile(data, 50),
            percentile(data, 75)
        ];

        myBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['25th Percentile', 'Median (50th Percentile)', '75th Percentile'],
                datasets: [{
                    label: '難易度パーセンタイル',
                    data: percentiles,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(153, 102, 255, 0.5)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '難易度'
                        }
                    }
                }
            }
        });
    } else {
        alert("資格データがありません。");
    }
}

// パーセンタイルを計算する関数
function percentile(arr, p) {
    arr.sort((a, b) => a - b);
    const index = (p / 100) * (arr.length - 1);
    if (Math.floor(index) === index) {
        return arr[index];
    } else {
        const lower = arr[Math.floor(index)];
        const upper = arr[Math.ceil(index)];
        return lower + (upper - lower) * (index - Math.floor(index));
    }
}
