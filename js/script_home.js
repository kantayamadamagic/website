const button = document.getElementById("dark-button");

button.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
    // ダークモードになった
        document.getElementById("dark-button").textContent = "☀️ ライトモード";
    } else {
        // ライトモードになった
        document.getElementById("dark-button").textContent = "🌙 ダークモード";
    }
});
