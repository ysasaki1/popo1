<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>資格の難易度表示</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        /* グラフのコンテナスタイル */
        #myChart {
            max-width: 400px;
            margin: 20px auto;
        }
    </style>
</head>
<body>
    <div class="form-section">
        <h2>登録した資格の難易度パーセンタイル</h2>
        <canvas id="myChart"></canvas>
    </div>

    <script>
        // グラフデータ
        const data = {
            labels: ['資格A', '資格B', '資格C', '資格D', '資格E'], // 資格名
            datasets: [{
                label: '難易度パーセンタイル',
                data: [30, 70, 50, 90, 80], // 各資格の難易度パーセンタイル
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        };

        // グラフ設定
        const config = {
            type: 'bar', // グラフの種類（棒グラフ）
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true, // Y軸を0から始める
                        title: {
                            display: true,
                            text: 'パーセンタイル'
                        }
                    }
                }
            }
        };

        // グラフの描画
        const myChart = new Chart(
            document.getElementById('myChart'),
            config
        );
    </script>
</body>
</html>
