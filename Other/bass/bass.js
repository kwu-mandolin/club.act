const HomeURL = "../game.html"; // ホーム画面のURLを指定

// ローカルストレージに "Party Invitation" があるか確認
function checkInvitation() {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    console.log(items);
    if (items.includes("Party Invitation")) {
        startGame(); // 招待状があれば販売開始
    } else {
        displayMessage(); // 招待状がなければメッセージを表示
    }
}

function startGame() {
    // 容疑者データ
    const suspects = [{
            id: 1,
            name: "A",
            statement: "私は犯人ではありません。",
            isLiar: false
        },
        {
            id: 2,
            name: "B",
            statement: "Eさんの証言は本当です。",
            isLiar: false
        },
        {
            id: 3,
            name: "C",
            statement: "Bさんは犯人ではありません。",
            isLiar: false
        },
        {
            id: 4,
            name: "D",
            statement: "Aが犯人です。",
            isLiar: true
        },
        {
            id: 5,
            name: "E",
            statement: "Cさんの言ってることは本当です。",
            isLiar: false
        },
        {
            id: 6,
            name: "F",
            statement: "Dさんが怪しいです。",
            isLiar: false
        },
    ];

    // ゲームを初期化
    function initializeGame() {
        const suspectsDiv = document.getElementById("suspects");
        suspects.forEach((suspect) => {
            // 容疑者カードを作成
            const suspectCard = document.createElement("div");
            suspectCard.className = "suspect";
            suspectCard.innerHTML = `
            <strong>${suspect.name}</strong>
            <p>${suspect.statement}</p>
        `;
            // クリックイベントを追加
            suspectCard.onclick = () => checkSuspect(suspect);
            suspectsDiv.appendChild(suspectCard);
        });
    }

    // ゲーム開始
    initializeGame();

    const resultDiv = document.getElementById("result");
    // 容疑者をチェック
    function checkSuspect(suspect) {
        if (suspect.isLiar) {
            alert("ご名答。犯人は " + suspect.name + " です。");
            resultDiv.innerHTML = "おめでとうございます　　▼";
            resultDiv.style.cursor = "pointer"; // クリック可能にする
            resultDiv.addEventListener("click", () => showNextMessage()); // クリックで次のメッセージ
        } else {
            alert("どうやら違う様です。もう一度考えてみましょう。");
        }
    }

    // 次のメッセージを表示する関数
    function showNextMessage() {
        const items = JSON.parse(localStorage.getItem("items")) || [];

        // すでに鍵を持っているかをチェック
        if (!items.includes("Plaza Key")) {
            resultDiv.innerHTML = "その推理力、恐れ入りました。　　　<br>こちらをお受け取りください。　　　▼";
            resultDiv.addEventListener("click", () => giveKey(), {
                once: true
            }); // クリックで次のメッセージ
        } else {
            // すでに鍵を持っている場合は次のメッセージを表示しない
            resultDiv.innerHTML = "一度解かれた謎ですから、正解するのが普通ですが。";
        }
    }

    // 招待状を手に入れる処理
    function giveKey() {
        resultDiv.textContent = "広場の鍵を手に入れた";
        const items = JSON.parse(localStorage.getItem("items")) || [];
        items.push("Plaza Key"); // アイテムに追加
        localStorage.setItem("items", JSON.stringify(items)); // 保存
    }
}

function displayMessage() {
    const Game = document.getElementById("game");
    Game.style.display = "none";

    // メッセージ表示
    const message = document.createElement("p");
    message.innerHTML = "招待状の無い方の入場はご遠慮いただいています。<br>お引き取りください。";
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

//実行
checkInvitation();
//確認用(キャッシュクリア)
//localStorage.clear();