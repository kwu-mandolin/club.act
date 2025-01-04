const HomeURL = "../game.html"; // ホーム画面のURLを指定

// ローカルストレージに "Drink Card" があるか確認
function checkCard() {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    console.log(items);
    if (items.includes("Drink Card")) {
        startBuy(); // カードがあれば販売開始
    } else {
        displayMessage(); // カードがなければメッセージを表示
    }
}

function startBuy() {
    // ここにゲーム開始時の処理を追加
    const items = [{
            name: "ジントニック",
            description: "ライムの酸味が爽やかな、カクテルの定番です"
        },
        {
            name: "マティーニ",
            description: "「カクテルの王様」と呼ばれています。当店ではレモンの果肉を使用しております"
        },
        {
            name: "マンハッタン",
            description: "マティーニと対して「カクテルの女王」と呼ばれるウイスキーベースのカクテルです"
        },
        {
            name: "レッドアイ",
            description: "デザートのようなカクテル。鮮やかな緑から名付けられました"
        },
        {
            name: "グラスホッパー",
            description: "ビールとトマトジュースで作る真っ赤なカクテルです"
        }
    ];

    const itemList = document.getElementById("item-list");
    const speechBubble = document.getElementById("speech-bubble");

    // アイテムリストを生成
    items.forEach(item => {
        const li = document.createElement("li");
        const itemName = document.createElement("span");
        itemName.textContent = item.name;

        li.appendChild(itemName);

        // 吹き出しの説明表示を商品全体に適用
        li.addEventListener("mouseover", () => {
            if (!speechBubble.textContent.includes("ありがとうございます。")) {
                speechBubble.textContent = item.description;
            }
            speechBubble.style.display = "block";
        });

        // ホバーが外れたら説明を非表示
        li.addEventListener("mouseout", () => {
            if (!speechBubble.textContent.includes("ありがとうございます。")) {
                speechBubble.style.display = "none";
            }
        });

        li.addEventListener("click", () => handleItemClick(item));
        itemList.appendChild(li);
    });
    // アイテムをクリックしたときの処理
    function handleItemClick(item) {
        // 吹き出しに購入メッセージを表示
        speechBubble.textContent = `${item.name}をお求めですか？`;
        speechBubble.style.display = "block";

        // 購入確認ダイアログを表示
        setTimeout(() => {
            const confirmation = confirm(`${item.name}を購入しますか？`);
            if (confirmation) {
                // 購入確定後の「ありがとうございます」メッセージ
                speechBubble.innerHTML = "ありがとうございます。　　▼";
                speechBubble.style.cursor = "pointer"; // クリック可能にする
                speechBubble.addEventListener("click", () => showNextMessage()); // クリックで次のメッセージ
            } else {
                // 購入しなかった場合はメッセージを消す
                speechBubble.style.display = "none";
            }
        }, 1000); // 購入確認ダイアログまでの遅延時間
    }

    // 次のメッセージを表示する関数
    function showNextMessage() {
        const items = JSON.parse(localStorage.getItem("items")) || [];

        // すでに花図鑑を持っているかをチェック
        if (!items.includes("flower book")) {
            speechBubble.innerHTML = "お客様、よろしければこちらもどうぞ。<br>お好きにご利用ください。　　　　　▼";
            speechBubble.addEventListener("click", () => giveFlowerBook(), { once: true }); // クリックで次のメッセージ
        } else {
            // すでに花図鑑を持っている場合は次のメッセージを表示しない
            speechBubble.innerHTML = "またのお越しをお待ちしております";
        }
    }


    // 花図鑑を手に入れる処理
    function giveFlowerBook() {
        const items = JSON.parse(localStorage.getItem("items")) || [];
        speechBubble.textContent = "なぜか花図鑑を手に入れた";
        items.push("flower book"); // アイテムに追加
        localStorage.setItem("items", JSON.stringify(items)); // 保存
    }
}


function displayMessage() {
    const menuSection = document.querySelector('.menu-section');
    const counterSection = document.querySelector('.counter-section');
    const shopContainer = document.querySelector('.shop-container'); // 背景の枠も非表示にしたい場合
    menuSection.style.display = 'none';
    counterSection.style.display = 'none';
    shopContainer.style.display = 'none';

    // メッセージ表示
    const message = document.createElement("p");
    message.innerHTML = "失礼ですがカードもお金もお持ちでないご様子。<br>また後程ご来店ください";
    message.style.textAlign = "center";
    message.style.marginTop = "200px";
    message.style.marginLeft = "400px";
    message.style.fontSize = "18px";
    document.body.appendChild(message);

    // ホームに戻るボタンを表示
    const homeButton = document.createElement("button");
    homeButton.textContent = "ホームに戻る";
    homeButton.style.display = "block";
    homeButton.style.margin = "350px auto";
    homeButton.style.marginLeft = "-270px"; // ボタンを少し左に移動
    homeButton.style.marginTop = "300px"; // ボタンを少し左に移動
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
checkCard();
//確認用(キャッシュクリア)
//localStorage.clear();