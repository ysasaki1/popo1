<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ユーザーページ</title>
    <link rel="stylesheet" href="style.css">
    <script type="module" src="user.js"></script>
</head>
<body>
    <div class="container">
        <h1>ユーザーページ</h1>
        <p id="welcomeMessage"></p>
        
        <div class="form-section">
            <h2>資格・受賞歴の登録</h2>
            <input type="text" id="qualification" placeholder="資格・受賞歴" required>
            <button id="addQualificationButton" class="small-button">追加</button>
        </div>

        <div class="form-section">
            <h2>登録された資格・受賞歴</h2>
            <ul id="qualificationList"></ul>
        </div>

        <button id="logoutButton" class="small-button">ログアウト</button>
    </div>
</body>
</html>
