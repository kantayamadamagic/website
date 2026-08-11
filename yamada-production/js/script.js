const filterButtons = document.querySelectorAll(".filter-button");
const talentCards = document.querySelectorAll(".talent-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter =
            button.dataset.filter;
        // Active button
        filterButtons.forEach(button => {
            button.classList.remove("active");
        });
        button.classList.add("active");
        // Filter cards
        talentCards.forEach(card => {
            const category =
                card.dataset.category;
            if (filter === "all" || category === filter) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });
});
