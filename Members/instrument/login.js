// あなたのGASのURLをここに貼り付けてください
const GAS_URL = "https://script.google.com/macros/s/【あなたのGASのURL】/exec";

document.getElementById("loginBtn").addEventListener("click", login);

function login() {
  const password = document.getElementById("password").value;

  fetch(GAS_URL + "?password=" + encodeURIComponent(password))
    .then(res => res.json())
    .then(data => {
      if (data.result === "success") {
        window.location.href = "instrument.html"; // ログイン成功 → 部員ページへ
      } else {
        document.getElementById("message").textContent = "パスワードが違います。";
      }
    })
    .catch(err => {
      document.getElementById("message").textContent = "通信エラーが発生しました。";
      console.error(err);
    });
}

