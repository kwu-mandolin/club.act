// 🔹 GASのURL（デプロイした /exec の URL を入れてください）
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzMTD4G2_2320ILDTi-V9-riSt0xVvdOC18X9AiSoNWyIpCFICk-gx-ajtSyvb18_c/exec';

// loadData: instrument を渡すと絞り込み（空文字で全件）
function loadData(instrument = '') {
    const url = instrument ? `${GAS_URL}?instrument=${encodeURIComponent(instrument)}` : GAS_URL;
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';

    request.onload = function () {
        const data = this.response;
        const rows = data['date'] || [];
        const output = document.getElementById('output');

        // テーブル作成（最初の列はチェックボックス、最後の列は操作）
        output.innerHTML = "<table><thead></thead><tbody></tbody></table>";
        const table = output.querySelector("table");
        const thead = table.querySelector("thead");
        const tbody = table.querySelector("tbody");

        // ヘッダー
        const headerRow = document.createElement('tr');
        ["選択","楽器","使用者","購入年","メーカー","備品番号","メモ","操作"].forEach(h => {
            const th = document.createElement('th');
            th.innerText = h;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // rows は各要素が [sheetRowNumber, col1, col2, ..., colN]
        rows.forEach((rowArr) => {
            const sheetRow = rowArr[0];          // シート上の行番号（例: 2,3,...）
            const rowData = rowArr.slice(1);    // 実データ（6要素想定）

            const tr = document.createElement('tr');

            // チェックボックスセル
            const tdCheck = document.createElement('td');
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.dataset.sheetRow = sheetRow; // 削除時に使う
            tdCheck.appendChild(cb);
            tr.appendChild(tdCheck);

            // データセル（6列を想定）
            rowData.forEach(cellData => {
                const td = document.createElement('td');
                td.innerText = cellData;
                tr.appendChild(td);
            });

            // 操作セル（編集ボタン）
            const tdOp = document.createElement('td');
            const editBtn = document.createElement('button');
            editBtn.textContent = '編集';
            editBtn.addEventListener('click', () => {
                openEditModal(sheetRow, rowData);
            });
            tdOp.appendChild(editBtn);
            tr.appendChild(tdOp);

            tbody.appendChild(tr);
        });
    };

    request.onerror = function () {
        document.getElementById('output').innerText = "通信エラーが発生しました";
    };

    request.send();
}

// 絞り込みボタン
document.getElementById('filter-btn').addEventListener('click', () => {
    const sel = document.getElementById('filter-select').value;
    loadData(sel);
});
document.getElementById('clear-filter').addEventListener('click', () => {
    document.getElementById('filter-select').value = '';
    loadData();
});

// 追加ボタン
document.getElementById('add-btn').addEventListener('click', () => {
    const newData = {
        instrument: document.getElementById('instrument').value || '',
        user: document.getElementById('user').value || '',
        year: document.getElementById('year').value || '',
        maker: document.getElementById('maker').value || '',
        number: document.getElementById('number').value || '',
        memo: document.getElementById('memo').value || ''
    };
    if (!newData.instrument) { alert('楽器名を入力してください'); return; }

    fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors', // 注意：レスポンスは見えませんがGAS側で追加されます
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
    }).then(() => {
        alert('追加しました！ページを更新してください！');
        // フォームクリア
        document.querySelectorAll('#form input').forEach(i => i.value = '');
        loadData();
    }).catch(err => {
        console.error(err);
        alert('追加に失敗しました');
    });
});

// 削除ボタン（チェックされた行を削除）
document.getElementById('delete-btn').addEventListener('click', () => {
    const checked = Array.from(document.querySelectorAll('#output input[type="checkbox"]:checked'));
    if (checked.length === 0) { alert('削除する楽器を選択してください'); return; }
    if (!confirm('指定した範囲を削除しますか？')) return;

    const rowsToDelete = checked.map(cb => Number(cb.dataset.sheetRow));
    // 送信する際はエンコード
    const url = `${GAS_URL}?delete=${encodeURIComponent(JSON.stringify(rowsToDelete))}`;

    fetch(url, { method: 'GET', mode: 'no-cors' })
        .then(() => {
            alert('削除しました。ページを更新してください。');
            loadData(document.getElementById('filter-select').value);
        })
        .catch(err => {
            console.error(err);
            alert('削除に失敗しました');
        });
});

// ---------------------
// 編集モーダル関連
// ---------------------
function openEditModal(sheetRow, rowData) {
    // sheetRow: シート上の行番号、rowData: [instrument,user,year,maker,number,memo]
    document.getElementById('edit-id').value = sheetRow;
    document.getElementById('edit-instrument').value = rowData[0] || '';
    document.getElementById('edit-user').value = rowData[1] || '';
    document.getElementById('edit-year').value = rowData[2] || '';
    document.getElementById('edit-maker').value = rowData[3] || '';
    document.getElementById('edit-number').value = rowData[4] || '';
    document.getElementById('edit-memo').value = rowData[5] || '';

    document.getElementById('edit-modal').style.display = 'block';
}

document.getElementById('cancel-edit').addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
});

document.getElementById('save-edit').addEventListener('click', () => {
    const updated = {
        row: Number(document.getElementById('edit-id').value), // シート行番号
        instrument: document.getElementById('edit-instrument').value,
        user: document.getElementById('edit-user').value,
        year: document.getElementById('edit-year').value,
        maker: document.getElementById('edit-maker').value,
        number: document.getElementById('edit-number').value,
        memo: document.getElementById('edit-memo').value
    };

    fetch(GAS_URL, {
        method: 'POST',    // doPost が「更新」も扱うようにしています
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
    }).then(() => {
        alert('編集しました！ページを更新してください！');
        document.getElementById('edit-modal').style.display = 'none';
        loadData(document.getElementById('filter-select').value);
    }).catch(err => {
        console.error(err);
        alert('更新に失敗しました');
    });
});

// 初期表示（全件）
loadData();
