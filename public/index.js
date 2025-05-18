const pokemonList = document.getElementById("pokemonList");
const pokemonTemplate = document.getElementById("pokemonTemplate");
const pokemonGrid = document.getElementById("pokemonGrid");

async function loadPokemon(size = 16) {
    let rows = Math.sqrt(size);
    let ids = [];
    for (let i = 0; i < size; i++) {
        let id = Math.floor(Math.random() * 1000) + 1;
        while (ids.includes(id)) {
            id = Math.floor(Math.random() * 1000) + 1;
        }
        ids.push(id);
    }
    curId = 0;
    for (let id of ids) {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${id}&limit=10`);
        let jsonObj = await response.json();
        let pokemon = jsonObj.results[0];
        let response2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
        let thisPokemon = await response2.json();
        for (let i = 0; i < 2; i++) {
            let newPokemon = pokemonTemplate.content.cloneNode(true);
            newPokemon.querySelector(".card-img-top").src = thisPokemon.sprites.other['official-artwork'].front_default;
            newPokemon.id = `pokemon-${curId}`;
            pokemonList.appendChild(newPokemon);
            curId++;
        }
    }
    for (let i = pokemonList.children.length; i >= 0; i--) {
        pokemonList.appendChild(pokemonList.children[Math.random() * i | 0]);
    }
    for (let i = 0; i < rows; i++) {
        let newRow = document.createElement("div");
        newRow.classList.add("row");
        pokemonGrid.appendChild(newRow);
        for (let t = 0; t < rows; t++) {
            newRow.appendChild(pokemonList.children[(i * rows) + t]);
        }
    }
    pokemonList.remove();
    let cardStyle = document.createElement("style");
    cardStyle.innerHTML = `
        .card {
            min-width: ${Math.floor(90 / rows)}% !important;
            max-width: ${Math.floor(90 / rows)}% !important;
            width: ${Math.floor(90 / rows)}% !important;
            min-height: ${Math.floor(600 / rows)}px !important;
            max-height: ${Math.floor(600 / rows)}px !important;
            height: ${Math.floor(600 / rows)}% !important;
        }
            `;
    document.head.appendChild(cardStyle);
}

function setup() {
    let firstCard;
    let secondCard;
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", function click(e) {
            if (!card.classList.contains("flip")) {
                return;
            }
            card.classList.toggle("flip");
            e.preventDefault();
            
            if (!firstCard) {
                firstCard = card.querySelector("img");
            } else {
                secondCard = card.querySelector("img");
                if (firstCard.src === secondCard.src && firstCard !== secondCard) {
                    console.log("match");
                    secondCard.parentElement.parentElement.replaceWith(secondCard.parentElement.parentElement.cloneNode(true));
                    firstCard.parentElement.parentElement.replaceWith(firstCard.parentElement.parentElement.cloneNode(true));
                    firstCard = null;
                    secondCard = null;
                } else {
                    setTimeout(() => {
                        if (firstCard && secondCard) {
                            firstCard.parentElement.parentElement.classList.toggle("flip");
                            secondCard.parentElement.parentElement.classList.toggle("flip");
                            firstCard = null;
                            secondCard = null;
                        }
                    }, 500);
                }

            }
        });
    });
}

loadPokemon().then(() => {
    setup();
});
