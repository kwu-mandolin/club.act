// アイテム管理用

/**
 * ローカルストレージにアイテムを保存
 * @param {string} item - 保存するアイテム名
 */
function saveItem(item) {
    let items = JSON.parse(localStorage.getItem("items")) || [];
    if (!items.includes(item)) {
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
    }
}

/**
 * 保存されたアイテム一覧を取得
 * @returns {Array} - アイテムの配列
 */
function getItems() {
    return JSON.parse(localStorage.getItem("items")) || [];
}

/**
 * アイテムが存在するか確認
 * @param {string} item - 確認するアイテム名
 * @returns {boolean} - アイテムが存在する場合は true、存在しない場合は false
 */
function hasItem(item) {
    const items = getItems();
    return items.includes(item);
}

/**
 * 保存されたアイテムを削除
 * @param {string} item - 削除するアイテム名
 */
function removeItem(item) {
    let items = JSON.parse(localStorage.getItem("items")) || [];
    items = items.filter(existingItem => existingItem !== item);
    localStorage.setItem("items", JSON.stringify(items));
}

/**
 * 全てのアイテムを削除
 */
function clearItems() {
    localStorage.removeItem("items");
}

