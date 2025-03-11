const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const totalScoreDisplay = document.getElementById("total-score");
const timeDisplay = document.getElementById("time");
const playAgainButton = document.getElementById("play-again");
const infoDisplay = document.getElementById("info");

const HomeURL = "../game.html"; // ホーム画面のURLを指定

let score = 0;
let totalScore = 0;
let timeLeft = 15;
let gameInterval;
let targetInterval;

// スコア設定 (小さいほど得点が高い)
const targetScores = {
    small: 20,
    medium: 10,
    large: 5,
};

// カード獲得の値
const ItemThreshold = 150; 

// カードが既に獲得されたかを確認
let ItemEarned = localStorage.getItem("ItemEarned") === "true";

// ゲーム開始前にチケットを確認し、存在すればゲームを開始
checkTicket();

// ゲームを開始
function startGame() {
    score = 0;
    timeLeft = 15;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    playAgainButton.style.display = "none";

    gameInterval = setInterval(updateTimer, 1000);
    targetInterval = setInterval(spawnTarget, 800);
}

// ゲーム終了
function endGame() {
    clearInterval(gameInterval);
    clearInterval(targetInterval);
    gameContainer.innerHTML = ""; // 的を削除
    totalScore += score;
    totalScoreDisplay.textContent = totalScore;

    // 合計スコアが300を超えたらカードを獲得
    checkForItem(totalScore);

    playAgainButton.style.display = "inline-block";
}

// タイマー更新
function updateTimer() {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
        endGame();
    }
}

// 的を生成
function spawnTarget() {
    const target = document.createElement("div");

    // 的のサイズをランダムで決定
    const size = Math.random() < 0.5 ? "large" : Math.random() < 0.7 ? "medium" : "small";
    target.classList.add("target");

    // 大きさを設定
    const targetSize = size === "small" ? 30 : size === "medium" ? 50 : 70;
    target.style.height = `${targetSize}px`;
    target.style.width = `${targetSize}px`;

    // 広めの当たり判定を設定
    const hitboxSize = targetSize + 20; // 当たり判定を大きめにする
    target.style.padding = `${(hitboxSize - targetSize) / 2}px`;

    // 上段か下段かをランダムで決定
    const row = Math.random() < 0.5 ? "upper" : "lower";
    if (row === "upper") {
        target.style.top = "50px";
        target.style.left = "-70px";
        target.style.animation = `move-right 5s linear`;
    } else {
        target.style.top = `${gameContainer.offsetHeight - 120}px`;
        target.style.left = "800px";
        target.style.animation = `move-left 5s linear`;
    }

    // クリック時にスコア加算
    target.addEventListener("click", () => {
        score += targetScores[size];
        scoreDisplay.textContent = score;
        target.remove();
    });

    // 的を削除
    target.addEventListener("animationend", () => target.remove());

    gameContainer.appendChild(target);
}

// カード獲得チェック
function checkForItem(totalScore) {
    if (!ItemEarned && totalScore >= ItemThreshold) {
        const item = "Drink Card"; // アイテム名
        saveItem(item); // アイテムを保存
        ItemEarned = true; // フラグを更新
        alert(`総合得点300点達成おめでとう！\n記念にドリンクカードをあげるよ!`);
    }
}

// アイテム保存 (共通化)
function saveItem(item) {
    let items = JSON.parse(localStorage.getItem("items")) || [];
    if (!items.includes(item)) {
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
    }
}

// 再挑戦
playAgainButton.addEventListener("click", startGame);

// チケットがあるか確認
function checkTicket() {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    if (items.includes("Circus Ticket")) {
        startGame(); // チケットがあればゲームを開始
    } else {
        displayMessage(); // チケットがなければメッセージを表示
    }
}

// メッセージを表示してホームに戻る
function displayMessage() {
    // ゲーム関連の表示を非表示にする
    gameContainer.style.display = "none";
    infoDisplay.style.display = "none";

    // メッセージ表示
    const message = document.createElement("p");
    message.innerHTML = "チケットを持ってないとここには入れないんだ<br>また後で遊びに来てね";
    message.style.textAlign = "center";
    message.style.marginTop = "200px";
    message.style.fontSize = "18px";
    document.body.appendChild(message);

    // ホームに戻るボタンを表示
    const homeButton = document.createElement("button");
    homeButton.textContent = "ホームに戻る";
    homeButton.style.display = "block";
    homeButton.style.margin = "20px auto";
    homeButton.style.padding = "10px 20px";
    homeButton.style.fontSize = "16px";
    homeButton.style.cursor = "pointer";
    document.body.appendChild(homeButton);

    // ボタンのクリックでホーム画面にリダイレクト
    homeButton.addEventListener("click", () => {
        window.location.href = HomeURL;
    });
}

// CSSアニメーション設定
const style = document.createElement("style");
style.textContent = `
    @keyframes move-left {
        from { left: 800px; }
        to { left: -90px; }
    }
    @keyframes move-right {
        from { left: -90px; }
        to { left: 800px; }
    }
`;
document.head.appendChild(style);

//確認用(キャッシュクリア)
//localStorage.clear();
