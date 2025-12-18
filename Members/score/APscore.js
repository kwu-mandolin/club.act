// 🔹 GASのURL（AP用）
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxNFzKh3SCwdAKLmfIOprlHkbZKfSop2cmyspeVBODI1SMbEO29F-8fjAuVTVukOe4/exec';

let allData = [];          // 取得した全データ（[rowNumber, number, title, ...]）
let currentFilterMode = 'all'; // 'all' | 'deleted' | 'others'

// ---------------------
// データ取得
// ---------------------
function loadData() {
  fetch(GAS_URL)
    .then(res => res.json())
    .then(json => {
      allData = json.date || [];
      applyFilters();  // 現在のフィルタ＋検索条件で表示
    })
    .catch(err => {
      alert('データ取得エラー: ' + err.message);
      console.error(err);
    });
}

// ---------------------
// フィルタ & 検索適用
// ---------------------
function applyFilters() {
  const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
  let data = allData.slice();

  // 削除のみ / 削除以外 フィルタ
  
  
  if (currentFilterMode === 'deleted') {
    data = data.filter(row => ((row[2] ?? '').toString().trim() === '削除'));
  } else if (currentFilterMode === 'others') {
    data = data.filter(row => ((row[2] ?? '').toString().trim() !== '削除'));
  }


  // 曲名による検索（タイトルは row[2]）
  if (keyword) {
    data = data.filter(row => {
      const title = (row[2] || '').toString().toLowerCase();
      return title.indexOf(keyword) !== -1;
    });
  }

  displayTable(data);
}

// ---------------------
// テーブル表示
// ---------------------
function displayTable(rows) {
  const output = document.getElementById('output');
  output.innerHTML = "<table><thead></thead><tbody></tbody></table>";

  const table = output.querySelector("table");
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");

  // ヘッダー
  const headerRow = document.createElement('tr');
  const headers = [
    "選択",
    "番号","曲名","作曲家","編集者",
    "総譜","1st","2nd","Dola","Cello","Guitar","Bass","Other",
    "操作"
  ];
  headers.forEach(h => {
    const th = document.createElement('th');
    th.innerText = h;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // 行データ
  rows.forEach(rowArr => {
    const sheetRow = rowArr[0];         // シートの行番号
    const values   = rowArr.slice(1);   // [number, title, composer, editor, score, part1, ... , other]

    const tr = document.createElement('tr');

    // チェックボックス
    const tdCheck = document.createElement('td');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.dataset.sheetRow = sheetRow;   // 削除時に使用
    tdCheck.appendChild(cb);
    tr.appendChild(tdCheck);

    // データセル
      values.forEach(val => {
    const td = document.createElement('td');
    td.innerText = (val === null || val === undefined) ? '' : val;
    tr.appendChild(td);
  });


    // 操作セル（編集）
    const tdOp = document.createElement('td');
    const editBtn = document.createElement('button');
    editBtn.textContent = '編集';
    editBtn.addEventListener('click', () => {
      openEditModal(sheetRow, values);
    });
    tdOp.appendChild(editBtn);
    tr.appendChild(tdOp);

    tbody.appendChild(tr);
  });
}

// ---------------------
// 検索ボタン
// ---------------------
document.getElementById('search-btn').addEventListener('click', () => {
  applyFilters();
});

// 全件表示
document.getElementById('show-all').addEventListener('click', () => {
  currentFilterMode = 'all';
  applyFilters();
});

// 削除のみ
document.getElementById('show-deleted').addEventListener('click', () => {
  currentFilterMode = 'deleted';
  applyFilters();
});

// 削除以外
document.getElementById('show-others').addEventListener('click', () => {
  currentFilterMode = 'others';
  applyFilters();
});

// ---------------------
// 新規追加
// ---------------------
document.getElementById('add-btn').addEventListener('click', () => {
  const data = {
    row: document.getElementById('row').value || '', // 新規は空
    number: document.getElementById('number').value || '',
    title: document.getElementById('title').value || '',
    composer: document.getElementById('composer').value || '',
    editor: document.getElementById('editor').value || '',
    score: document.getElementById('score').value || '',
    part1: document.getElementById('part1').value || '',
    part2: document.getElementById('part2').value || '',
    dola: document.getElementById('dola').value || '',
    cello: document.getElementById('cello').value || '',
    guitar: document.getElementById('guitar').value || '',
    bass: document.getElementById('bass').value || '',
    other: document.getElementById('other').value || ''
  };

  if (!data.title) {
    alert('曲名を入力してください。');
    return;
  }

  fetch(GAS_URL, {
    method: 'POST',
    mode: 'no-cors',   // 楽器管理サイトと同じくレスポンスは見ない運用
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(() => {
    alert('追加しました！');
    clearForm();
    loadData();
  }).catch(err => {
    console.error(err);
    alert('保存エラー: ' + err.message);
  });
});

// フォームクリア
document.getElementById('clear-form').addEventListener('click', () => {
  clearForm();
});

function clearForm() {
  document.getElementById('row').value = '';
  document.getElementById('number').value   = '';
  document.getElementById('title').value    = '';
  document.getElementById('composer').value = '';
  document.getElementById('editor').value   = '';
  document.getElementById('score').value    = '';
  document.getElementById('part1').value    = '';
  document.getElementById('part2').value    = '';
  document.getElementById('dola').value     = '';
  document.getElementById('cello').value    = '';
  document.getElementById('guitar').value   = '';
  document.getElementById('bass').value     = '';
  document.getElementById('other').value    = '';
}

// ---------------------
// チェックした曲を削除
// ---------------------
document.getElementById('delete-selected').addEventListener('click', () => {
  const checked = Array.from(document.querySelectorAll('#output input[type="checkbox"]:checked'));
  if (checked.length === 0) {
    alert('削除する曲を選択してください。');
    return;
  }
  if (!confirm('指定した曲を削除しますか？')) return;

  const rowsToDelete = checked.map(cb => Number(cb.dataset.sheetRow));
  const url = `${GAS_URL}?delete=${encodeURIComponent(JSON.stringify(rowsToDelete))}`;

  fetch(url, { method: 'GET', mode: 'no-cors' })
    .then(() => {
      alert('削除しました。');
      loadData();
    })
    .catch(err => {
      console.error(err);
      alert('削除エラー: ' + err.message);
    });
});

// ---------------------
// 編集モーダル関連
// ---------------------
function openEditModal(sheetRow, values) {
  // values: [number, title, composer, editor, score, part1, part2, dola, cello, guitar, bass, other]
  document.getElementById('edit-row').value      = sheetRow;
  document.getElementById('edit-number').value   = values[0] || '';
  document.getElementById('edit-title').value    = values[1] || '';
  document.getElementById('edit-composer').value = values[2] || '';
  document.getElementById('edit-editor').value   = values[3] || '';
  document.getElementById('edit-score').value    = values[4] || '';
  document.getElementById('edit-part1').value    = values[5] || '';
  document.getElementById('edit-part2').value    = values[6] || '';
  document.getElementById('edit-dola').value     = values[7] || '';
  document.getElementById('edit-cello').value    = values[8] || '';
  document.getElementById('edit-guitar').value   = values[9] || '';
  document.getElementById('edit-bass').value     = values[10] || '';
  document.getElementById('edit-other').value    = values[11] || '';

  document.getElementById('edit-modal').style.display = 'block';
}

document.getElementById('cancel-edit').addEventListener('click', () => {
  document.getElementById('edit-modal').style.display = 'none';
});

document.getElementById('save-edit').addEventListener('click', () => {
  const updated = {
    row: Number(document.getElementById('edit-row').value),
    number: document.getElementById('edit-number').value   || '',
    title:  document.getElementById('edit-title').value    || '',
    composer: document.getElementById('edit-composer').value || '',
    editor:   document.getElementById('edit-editor').value   || '',
    score:    document.getElementById('edit-score').value    || '',
    part1:    document.getElementById('edit-part1').value    || '',
    part2:    document.getElementById('edit-part2').value    || '',
    dola:     document.getElementById('edit-dola').value     || '',
    cello:    document.getElementById('edit-cello').value    || '',
    guitar:   document.getElementById('edit-guitar').value   || '',
    bass:     document.getElementById('edit-bass').value     || '',
    other:    document.getElementById('edit-other').value    || ''
  };

  if (!updated.title) {
    alert('曲名を入力してください。');
    return;
  }

  fetch(GAS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated)
  }).then(() => {
    alert('編集しました！');
    document.getElementById('edit-modal').style.display = 'none';
    loadData();
  }).catch(err => {
    console.error(err);
    alert('更新エラー: ' + err.message);
  });
});

// ---------------------
// 初期表示
// ---------------------
window.addEventListener('load', () => {
  loadData();
});
