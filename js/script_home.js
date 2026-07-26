const isDarkMode = localStorage.getItem("darkMode");
if (isDarkMode === "true") {
    document.body.classList.add("dark-mode");
    document.getElementById("dark-button").textContent = "☀️ ライトモード";
}

const darkbutton = document.getElementById("dark-button");
darkbutton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    if (document.body.classList.contains("dark-mode")) {
    // ダークモードになった
        document.getElementById("dark-button").textContent = "☀️ ライトモード";
    } else {
        // ライトモードになった
        document.getElementById("dark-button").textContent = "🌙 ダークモード";
    }
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
