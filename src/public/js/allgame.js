function searchGames() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let cards = document.querySelectorAll(".game-card");

    cards.forEach(card => {
        let name = card.dataset.name.toLowerCase();
        card.style.display = name.includes(input) ? "block" : "none";
    });
}

function filterCategory() {
    let selected = document.getElementById("categoryFilter").value;
    let cards = document.querySelectorAll(".game-card");

    cards.forEach(card => {
        let category = card.dataset.category;
        if(selected === "all" || category === selected) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}
