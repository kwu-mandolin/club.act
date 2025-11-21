// あなたのGASのURLをここに貼り付けてください
const GAS_URL = "https://script.google.com/macros/s/AKfycbw914sgXney1cIgYBCYrKkaGa9LPJGXFT9w7AMSBZ9qiHjaYKnftXCszpn-2yrSA1jW/exec";

document.getElementById("loginBtn").addEventListener("click", login);

function login() {
  const password = document.getElementById("password").value;

  fetch(GAS_URL + "?password=" + encodeURIComponent(password))
    .then(res => res.json())
    .then(data => {
      if (data.result === "success") {
        window.location.href = "APscore.html"; // ログイン成功 → 部員ページへ
      } else {
        document.getElementById("message").textContent = "パスワードが違います。";
      }
    })
    .catch(err => {
      document.getElementById("message").textContent = "通信エラーが発生しました。";
      console.error(err);
    });
}
