// 診断チャート
const questions = [
    // 質問1
    {
        text: "目立つのはあまり好きではない",
        yes: 2,
        no: 4
    },
    // 質問2
    {
        text: "服を選ぶとしたら見た目より動きやすさを重視する",
        yes: "ドラ",
        no: null
    },
    // 質問3
    {
        text: "グループワークではよくリーダーを任される",
        yes: 5,
        no: 3
    },
    // 質問4
    {
        text: "将来は公務員や教師より芸術家やデザイナーになりたい",
        yes: "ベース",
        no: 6
    },
    // 質問5
    {
        text: "休みの日は家でゴロゴロすると決めている",
        yes: 5,
        no: 6
    },
    // 質問6
    {
        text: "カラオケでは今流行りの曲を歌う",
        yes: "2nd",
        no: 1
    },
    // 質問7
    {
        text: "人から不思議ちゃん、天然と言われたことがある",
        yes: null,
        no: null
    }
];

// 質問1の回答を記録する用
let firstAnswer = null;

// 現在の質問番号
let currentQuestion = 0;

// HTML要素の取得
const questionText = document.getElementById("question-text");
const questionBox = document.getElementById("question-box");
const resultBox = document.getElementById("result-box");
const resultText = document.getElementById("result-text");
const yesButton = document.getElementById("yes-button");
const noButton = document.getElementById("no-button");
const restartButton = document.getElementById("restart-button");

// 初期化
function startQuiz() {
    currentQuestion = 0;
    firstAnswer = null;
    questionBox.classList.remove("hidden");
    resultBox.classList.add("hidden");
    showQuestion();
}

// 質問を表示
function showQuestion() {
    const question = questions[currentQuestion];
    questionText.textContent = question.text;

    yesButton.onclick = () => handleAnswer("yes");
    noButton.onclick = () => handleAnswer("no");
}

// 回答を処理
function handleAnswer(answer) {
    const question = questions[currentQuestion];

    // 質問1の回答を記録
    if (currentQuestion === 0) {
        firstAnswer = answer;
    }

    // 次の質問または結果に進む
    if (answer === "yes") {
        if (typeof question.yes === "string") {
            // 結果を判定して表示
            showResult(determineResult(question.yes));
        } else if (question.yes !== null) {
            currentQuestion = question.yes;
            showQuestion();
        } else {
            // 特殊処理 (質問2, 質問7)
            showResult(determineResult(null));
        }
    } else if (answer === "no") {
        if (typeof question.no === "string") {
            // 結果を判定して表示
            showResult(determineResult(question.no));
        } else if (question.no !== null) {
            currentQuestion = question.no;
            showQuestion();
        } else {
            // 特殊処理 (質問2, 質問7)
            showResult(determineResult(null));
        }
    }
}

// 結果の判定
function determineResult(resultKey) {
    if (resultKey === null) {
        // 特殊処理
        if (currentQuestion === 1) {
            // 質問2
            return firstAnswer === "yes" ? "ギター" : "1st";
        } else if (currentQuestion === 6) {
            // 質問7
            return firstAnswer === "yes" ? "ギター" : "ベース";
        }
        return "エラー: 不明な結果";
    }
    return resultKey;
}

// item.js を読み込む
const script = document.createElement("script");
script.src = "../item.js";
document.head.appendChild(script);

// 現在の状態
let state = "result"; // 状態管理: "result" -> "nextStep" -> "ticket"

// 結果を表示
function showResult(result) {
    questionBox.classList.add("hidden");
    resultBox.classList.remove("hidden");
    resultText.innerHTML = `あなたの結果は「${result}」です！<br>　　　　　　　　　　　(▼)`;

    // 結果画面をクリックで次のメッセージに進む
    resultBox.onclick = () => handleNextStep();
}

// 2コメント目
function handleNextStep() {
    if (state === "result") {
        // 次のメッセージを表示
        state = "nextStep";
        // 診断結果のタイトルを非表示
        const resultTitle = document.querySelector("#result-box h2");
        if (resultTitle) resultTitle.style.display = "none";
        resultText.innerHTML = "結果はいかがでしたか？<br> 運の良いあなたにはこちらも差し上げましょう<br>　　　　　　　　　　　(▼)";
    } else if (state === "nextStep") {
        // チケット獲得メッセージを表示
        state = "ticket";
        resultText.innerHTML = "サーカスのチケット を<br> 手に入れた！";
        // チケットを保存
        saveItem("Circus Ticket");

    }
}

// リスタート
restartButton.onclick = startQuiz;

// 初期化を呼び出し
startQuiz();

//確認用(キャッシュクリア)
//localStorage.clear();