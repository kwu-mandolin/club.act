const locationURLs = {
    "占いの館": "mandolin/mandolin.html",
    "サーカス": "dola/dola.html",
    "バー": "cello/cello.html",
    "花屋": "guitar/guitar.html",
    "パーティー会場": "bass/bass.html",
    "広場": "plaza/plaza.html",
};

function goToLocation(location) {
    if (locationURLs[location]) {
        window.location.href = locationURLs[location]; //移動
    } else {
        document.getElementById('output').textContent = location + " のリンクが見つかりません。";
    }
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}


//確認用(キャッシュクリア)
//localStorage.clear();