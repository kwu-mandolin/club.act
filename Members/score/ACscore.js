const GAS_URL = 'https://script.google.com/macros/s/AKfycbzUYoB2XhIQXiwpep0D1ulS_y1FyfRucyMf-l7RdKOqfk7FNg4Np9ee4Tr_IqiXuru7/exec';

let allData = []; // ← 全データを保持しておく

// データ取得
async function loadData() {
  try {
    const res = await fetch(GAS_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    allData = json.date; // ← 一度保存しておく
    displayTable(allData); // ← 表示を分離
  } catch (err) {
    alert('データ取得エラー: ' + err.message);
    console.error(err);
  }
}

// テーブル表示関数（検索結果にも使う）
function displayTable(dataArray) {
  const tbody = document.querySelector('#scoreTable tbody');
  tbody.innerHTML = '';

  dataArray.forEach(row => {
    const rowNum = row[0]; // シートの行番号
    const values = row.slice(1); // 実データ

    const tr = document.createElement('tr');
    values.forEach(val => {
      const td = document.createElement('td');
      td.textContent = val;
      tr.appendChild(td);
    });

    const tdOps = document.createElement('td');
    const editBtn = document.createElement('button');
    editBtn.textContent = '編集';
    editBtn.onclick = () => editRow(rowNum, values);

    const delBtn = document.createElement('button');
    delBtn.textContent = '削除';
    delBtn.onclick = () => deleteRow(rowNum);

    tdOps.appendChild(editBtn);
    tdOps.appendChild(delBtn);
    tr.appendChild(tdOps);

    tbody.appendChild(tr);
  });
}

// 検索機能
function searchTitle() {
  const keyword = document.getElementById('searchInput').value.trim();
  if (keyword === '') {
    displayTable(allData); // 空なら全件
  } else {
    const filtered = allData.filter(row =>
      row[2] && row[2].toLowerCase().includes(keyword.toLowerCase()) // 曲名は3列目(row[2])
    );
    displayTable(filtered);
  }
}

// 編集
function editRow(row, values) {
  document.getElementById('row').value = row;
  const ids = ['number','title','composer','editor','score','part1','part2','dola','cello','guitar','bass','other'];
  ids.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.value = values[i] || '';
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 削除
async function deleteRow(row) {
  if (!confirm(`このデータを削除しますか？`)) return;
  try {
    const url = `${GAS_URL}?delete=${encodeURIComponent(JSON.stringify([row]))}`;
    const res = await fetch(url);
    const txt = await res.text();
    alert(txt);
    loadData();
  } catch (err) {
    alert('削除エラー: ' + err.message);
  }
}

// 保存
async function saveData() {
  const data = {
    row: document.getElementById('row').value || '',
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

  try {
    const res = await fetch(GAS_URL, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const txt = await res.text();
    alert(txt);
    resetForm();
    loadData();
  } catch (err) {
    alert('保存エラー: ' + err.message);
  }
}

function resetForm() {
  document.getElementById('dataForm').reset();
  document.getElementById('row').value = '';
}

window.onload = () => loadData();
