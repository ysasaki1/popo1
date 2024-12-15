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
let myPieChart;

// ページがロードされたときにユーザーの認証状態を確認
window.addEventListener('load', () => {
    checkUserAuth();
});

// ユーザーの認証状態を確認する関数
function checkUserAuth() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById('welcomeMessage').innerText = `${user.email}さん、ようこそ！`;
            loadCertifications(user.uid); // コレクション名を変更
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

    await addCertification(user.uid, qualification, difficulty); // 関数名を変更
    document.getElementById('qualification').value = '';
    document.getElementById('difficulty').value = '';
    await loadCertifications(user.uid); // コレクション名を変更
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
async function addCertification(uid, qualification, difficulty) { // 関数名を変更
    try {
        await addDoc(collection(db, "certifications"), { // コレクション名を変更
            uid: uid,
            qualification: qualification,
            difficulty: difficulty,
            createdAt: new Date().toISOString()
        });
        alert("資格・受賞歴が追加されました。");
        await loadCertifications(uid); // コレクション名を変更
    } catch (error) {
        console.error("資格の追加に失敗しました: ", error);
        alert("資格の追加に失敗しました。詳細: " + error.message);
    }
}

// 資格・受賞歴のロード
async function loadCertifications(uid) { // 関数名を変更
    const certificationList = document.getElementById('qualificationList'); // 変数名を変更
    certificationList.innerHTML = '';

    const q = query(collection(db, "certifications"), where("uid", "==", uid)); // コレクション名を変更
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
            await deleteCertification(doc.id); // 関数名を変更
        };

        li.appendChild(deleteButton);
        certificationList.appendChild(li);

        difficulties.push(data.difficulty);
    });

    drawPieChart(difficulties); // 難易度の配列を渡す
}

// 資格の削除
async function deleteCertification(id) { // 関数名を変更
    try {
        await deleteDoc(doc(db, "certifications", id)); // コレクション名を変更
        alert("資格・受賞歴が削除されました。");
        const user = auth.currentUser;
        await loadCertifications(user.uid); // コレクション名を変更
    } catch (error) {
        console.error("資格の削除に失敗しました: ", error);
    }
}

// 円グラフを描画
function drawPieChart(data) {
    const ctx = document.getElementById('myPieChart').getContext('2d');

    // 既存のチャートがある場合は破棄する
    if (myPieChart) {
        myPieChart.destroy();
    }

    // データが空でない場合のみ描画
    if (data.length > 0) {
        const percentiles = [
            percentile(data, 25),
            percentile(data, 50),
            percentile(data, 75)
        ];

        const labels = ['25th Percentile', 'Median (50th Percentile)', '75th Percentile'];
        const chartData = [percentiles[0], percentiles[1], percentiles[2]];

        myPieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: chartData,
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
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: '資格の難易度パーセンタイル'
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
