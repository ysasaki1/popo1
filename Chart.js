<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>箱ひげ図の例</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-chart-boxplot"></script>
    <style>
        /* グラフのコンテナスタイル */
        #myChart {
            max-width: 600px;
            margin: 20px auto;
        }
    </style>
</head>
<body>
    <h2>資格の難易度パーセンタイル（箱ひげ図）</h2>
    <canvas id="myChart"></canvas>

    <script>
        // データの設定
        const data = {
            labels: ['資格の難易度'],
            datasets: [{
                label: '難易度パーセンタイル',
                data: [{
                    min: 20,
                    q1: 30,
                    median: 50,
                    q3: 70,
                    max: 90
                }],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        // グラフの設定
        const config = {
            type: 'boxplot', // 箱ひげ図の種類
            data: data,
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
        };

        // グラフの描画
        const myChart = new Chart(
            document.getElementById('myChart'),
            config
        );
    </script>
</body>
</html>
