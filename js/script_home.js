const darkbutton = document.getElementById("dark-button");
const root = document.documentElement;
function updateDarkButton() {
    if (root.classList.contains("dark-mode")) {
        // ダークモードになった
        darkbutton.textContent = "☀️ ライトモード";
    } else {
        // ライトモードになった
        darkbutton.textContent = "🌙 ダークモード";
    }
}
// js/theme.js が復元したテーマにボタンの表示を合わせる
updateDarkButton();
darkbutton.addEventListener("click", function () {
    root.classList.toggle("dark-mode");
    localStorage.setItem("theme", root.classList.contains("dark-mode") ? "dark" : "light");
    updateDarkButton();
});

const hamburgerButton = document.getElementById("hamburger-button");
const hamburgerMenu = document.getElementById("hamburger-menu");
hamburgerButton.addEventListener("click", function () {
    hamburgerMenu.classList.toggle("show");
    if (hamburgerMenu.classList.contains("show")) {
        // メニューが表示された
        document.getElementById("hamburger-button").textContent = "✖";
    } else {
        // メニューが非表示になった
        document.getElementById("hamburger-button").textContent = "☰";
    }
});

const albumTitles = document.querySelectorAll(".album-title");
albumTitles.forEach(function (title) {
    title.addEventListener("click", function () {
        const trackList = this.nextElementSibling;
        trackList.classList.toggle("show");
        if (trackList.classList.contains("show")) {
            // トラックリストが表示された
            this.querySelector(".arrow").textContent = "▲";
        } else {
            // トラックリストが非表示になった
            this.querySelector(".arrow").textContent = "▼";
        }
    });
});
