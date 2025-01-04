const HomeURL = "../game.html"; // ホーム画面のURLを指定

// ローカルストレージに "Plaza Key" があるか確認
function checkKey() {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    console.log(items);
    if (items.includes("Plaza Key")) {
        startEnd(); // 鍵があれば販売開始
    } else {
        displayMessage(); // 鍵がなければメッセージを表示
    }
}

function startEnd() {
}


function displayMessage() {
    const Container = document.querySelector('.container');
    const Info = document.querySelector('.info');
    Container.style.display = 'none';
    Info.style.display = 'none';
    // メッセージ表示
    const message = document.createElement("p");
    message.innerHTML = "ここはみんなが集まる広場。<br>鍵がかかっていて入れない。";
    message.style.textAlign = "center";
    message.style.marginTop = "200px";
    message.style.marginLeft = "475px";
    message.style.fontSize = "18px";
    document.body.appendChild(message);

    // ホームに戻るボタンを表示
    const homeButton = document.createElement("button");
    homeButton.textContent = "ホームに戻る";
    homeButton.style.display = "block";
    homeButton.style.margin = "350px auto";
    homeButton.style.marginLeft = "-190px"; // ボタンを左右に移動
    homeButton.style.marginTop = "260px"; // ボタンを上下に移動
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
checkKey();
//確認用(キャッシュクリア)
//localStorage.clear();