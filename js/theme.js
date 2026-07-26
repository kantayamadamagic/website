// 描画前にテーマを反映してちらつきを防ぐため、<head> で同期的に読み込む。
// 保存された設定がなければ OS の設定に従う。
(function () {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (savedTheme === null && prefersDark)) {
        document.documentElement.classList.add("dark-mode");
    }
})();
