const HomeURL = "../game.html"; // ホーム画面のURLを指定

// ローカルストレージに "flower book" があるか確認
function checkBook() {
  const items = JSON.parse(localStorage.getItem("items")) || [];
  console.log(items);
  if (items.includes("flower book")) {
    startGame(); // 図鑑があれば販売開始
  } else {
    displayMessage(); // 図鑑がなければメッセージを表示
  }
}

function startGame() {
  // 花のデータ
  const flowerData = [{
      name: "ひまわり",
      trait: "大きな花",
      color: "黄",
      scent: "香りは控えめ",
      image: "images/sunflower.png"
    },
    {
      name: "バラ",
      trait: "小さな花",
      color: "赤",
      scent: "強い香り",
      image: "images/rose.png"
    },
    {
      name: "チューリップ",
      trait: "大きさは普通",
      color: "ピンク",
      scent: "香りは控えめ",
      image: "images/tulip.png"
    },
    {
      name: "デイジー",
      trait: "小さな花",
      color: "白",
      scent: "ほぼ無臭",
      image: "images/daisy.png"
    },
    {
      name: "ラベンダー",
      trait: "小さな花",
      color: "紫",
      scent: "強い香り",
      image: "images/lavender.png"
    },
    {
      name: "コスモス",
      trait: "大きさは普通",
      color: "オレンジ",
      scent: "香りは控えめ",
      image: "images/cosmos.png"
    },
    {
      name: "カーネーション",
      trait: "大きさは普通",
      color: "赤",
      scent: "ほぼ無臭",
      image: "images/carnation.png"
    },
    {
      name: "スイートピー",
      trait: "大きな花",
      color: "黄",
      scent: "香りは控えめ",
      image: "images/sweetpea.png"
    },
    {
      name: "スズラン",
      trait: "小さな花",
      color: "白",
      scent: "強い香り",
      image: "images/suzuran.png"
    },
    {
      name: "ダリア",
      trait: "大きな花",
      color: "青",
      scent: "香りは控えめ",
      image: "images/dahlia.png"
    },
  ];

  // 要素取得
  const requestDiv = document.getElementById("request");
  const flowersDiv = document.getElementById("flowers");
  const bouquetDiv = document.getElementById("bouquet");
  const evaluateButton = document.getElementById("evaluate");
  const resultDiv = document.getElementById("result");
  const flowerImage = document.getElementById("flower-image");
  const flowerDetails = document.getElementById("flower-details");

  // ランダムな依頼を設定
  const requests = [
    "元気な印象の大きな花",
    "優雅な印象の小さな花",
    "赤っぽい情熱的な花",
    "香りが強くて派手な花",
    "清楚な白い花",
  ];
  const currentRequest = requests[Math.floor(Math.random() * requests.length)];
  requestDiv.textContent = `依頼: ${currentRequest}`;

  // 花束選択数を初期化
  let bouquetCount = 0;

  // 花を生成
  flowerData.forEach((flower) => {
    const flowerDiv = document.createElement("div");
    flowerDiv.className = "flower";
    flowerDiv.textContent = flower.name;

    const tooltipText = `${flower.color}色、${flower.trait}。${flower.scent}`;
    flowerDiv.dataset.tooltip = tooltipText;
    flowerDiv.dataset.image = flower.image;
    flowerDiv.dataset.trait = flower.trait;
    flowerDiv.dataset.color = flower.color;
    flowerDiv.dataset.scent = flower.scent;

    flowerDiv.addEventListener("mouseover", () => {
      flowerImage.src = flowerDiv.dataset.image;
      flowerDetails.textContent = tooltipText;
      flowerImage.classList.add("show");
    });

    flowerDiv.addEventListener("mouseleave", () => {
      flowerImage.src = "";
      flowerDetails.textContent = "";
      flowerImage.classList.remove("show");
    });

    flowerDiv.addEventListener("click", () => {
      if (flowerDiv.classList.contains("selected")) {
        const bouquetFlowers = bouquetDiv.querySelectorAll(".in-bouquet");
        bouquetFlowers.forEach((clone) => {
          if (clone.textContent === flowerDiv.textContent) {
            bouquetDiv.removeChild(clone);
            flowerDiv.classList.remove("selected");
            bouquetCount--;
          }
        });

        if (bouquetCount < 3) {
          evaluateButton.disabled = true;
        }
      } else if (bouquetCount < 3) {
        const clone = flowerDiv.cloneNode(true);
        clone.classList.add("in-bouquet");
        bouquetDiv.appendChild(clone);
        flowerDiv.classList.add("selected");
        bouquetCount++;

        if (bouquetCount === 3) {
          evaluateButton.disabled = false;
        }
      }
    });

    flowersDiv.appendChild(flowerDiv);
  });

  // 評価処理
  evaluateButton.addEventListener("click", () => {
    const bouquetFlowers = bouquetDiv.querySelectorAll(".in-bouquet");

    let score = 0;

    bouquetFlowers.forEach((flower) => {
      if (currentRequest.includes("大") && flower.dataset.trait === "大きな花") score++;
      if (currentRequest.includes("小") && flower.dataset.trait === "小さな花") score++;
      if (currentRequest.includes("赤") && flower.dataset.color === "赤") score++;
      if (currentRequest.includes("香") && flower.dataset.scent.includes("強い香り")) score++;
      if (currentRequest.includes("白") && flower.dataset.color === "白") score++;
    });

    if (score >= 2) {
      resultDiv.innerHTML = "評価: 素晴らしい花束！依頼主は大満足！　　▼";
      evaluateButton.disabled = true;
      resultDiv.style.cursor = "pointer"; // クリック可能にする
      resultDiv.addEventListener("click", () => showNextMessage()); // クリックで次のメッセージ
    } else {
      resultDiv.textContent = "評価: 依頼主の要望に少し足りないかも。花束を作り直してください！";
    }
  });

  // 次のメッセージを表示する関数
  function showNextMessage() {
    const items = JSON.parse(localStorage.getItem("items")) || [];

    // すでに招待状を持っているかをチェック
    if (!items.includes("Party Invitation")) {
      resultDiv.innerHTML = "手伝ってくれてありがとう！　　　<br>お礼にこれをあげるわ。　　　▼";
      resultDiv.addEventListener("click", () => giveInvitation(), {
        once: true
      }); // クリックで次のメッセージ
    } else {
      // すでに招待状を持っている場合は次のメッセージを表示しない
      resultDiv.innerHTML = "また手伝ってくれてありがとう！<br>お手伝いはいつでも歓迎するわ！";
    }
  }

  // 招待状を手に入れる処理
  function giveInvitation() {
    resultDiv.textContent = "招待状を手に入れた";
    const items = JSON.parse(localStorage.getItem("items")) || [];
    items.push("Party Invitation"); // アイテムに追加
    localStorage.setItem("items", JSON.stringify(items)); // 保存
  }
}

function displayMessage() {
  const mainContainer = document.getElementById("main-container");
  const flowerContainer = document.getElementById("flower-container");
  const flowerDisplay = document.getElementById("flower-display");
  const Request = document.getElementById("request");
  const Bouquet = document.getElementById("bouquet");
  const Evaluate = document.getElementById("evaluate");
  const Result = document.getElementById("result");
  mainContainer.style.display = "none";
  flowerContainer.style.display = "none";
  flowerDisplay.style.display = "none";
  Request.style.display = "none";
  Bouquet.style.display = "none";
  Evaluate.style.display = "none";
  Result.style.display = "none";

  // メッセージ表示
  const message = document.createElement("p");
  message.innerHTML = "花の事を知ってる人じゃないと入れられないわ。<br>また後で来て頂戴。";
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
  homeButton.style.backgroundColor = "#f5f5f5";
  homeButton.style.border = "solid 1px #333";
  homeButton.style.color = "#333";
  document.body.appendChild(homeButton);

  // ボタンのクリックでホーム画面にリダイレクト
  homeButton.addEventListener("click", () => {
    window.location.href = HomeURL;
  });
}

//実行
checkBook();
//確認用(キャッシュクリア)
//localStorage.clear();