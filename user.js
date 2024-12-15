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
let myBoxPlotChart;

// ページがロードされたときにユーザーの認証状態を確認
window.addEventListener('load', () => {
    checkUserAuth();
});

// ユーザーの認証状態を確認する関数
function checkUserAuth() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // ユーザーがログインしている場合
            document.getElementById('welcomeMessage').innerText = `${user.email}さん、ようこそ！`;
            loadQualifications(user.uid);
        } else {
            // ユーザーが未ログインの場合
            window.location.href = 'index.html'; // 未ログインの場合はログインページにリダイレクト
        }
    });
}

// 資格・受賞歴の追加イベント
document.getElementById('addQualificationButton').addEventListener('click', async () => {
    const qualification = document.getElementById('qualification').value;
    const difficulty = parseInt(document.getElementById('difficulty').value); // 難易度を取得
    const user = auth.currentUser; // 現在のユーザーを取得

    if (!qualification || isNaN(difficulty)) {
        alert("資格・受賞歴と難易度を入力してください。");
        return; // 空の場合は処理を中止
    }

    await addQualification(user.uid, qualification, difficulty);
    document.getElementById('qualification').value = ''; // 入力をクリア
    document.getElementById('difficulty').value = ''; // 難易度をクリア
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

// 資格・受賞歴の追加
async function addQualification(uid, qualification, difficulty) {
    try {
        await addDoc(collection(db, "qualifications"), {
            uid: uid,
            qualification: qualification,
            difficulty: difficulty, // 難易度を追加
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
    
    const difficulties = []; // 難易度の配列を追加
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

        difficulties.push(data.difficulty); // 難易度を配列に追加
    });

    drawBoxPlot(difficulties); // 難易度の配列を渡す
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

// 箱ひげ図を描画
function drawBoxPlot(data) {
    const ctx = document.getElementById('myBoxPlotChart').getContext('2d');

    // 既存のチャートがある場合は破棄する
    if (myBoxPlotChart) {
        myBoxPlotChart.destroy(); // 既存のチャートを破棄
    }

    // データが空でない場合のみ描画
    if (data.length > 0) {
        myBoxPlotChart = new Chart(ctx, {
            type: 'boxplot',
            data: {
                labels: ['資格の難易度'],
                datasets: [{
                    label: '難易度パーセンタイル',
                    data: [
                        {
                            min: Math.min(...data),
                            q1: percentile(data, 25),
                            median: percentile(data, 50),
                            q3: percentile(data, 75),
                            max: Math.max(...data)
                        }
                    ],
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
