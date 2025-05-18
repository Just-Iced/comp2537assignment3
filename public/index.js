const pokemonList = document.getElementById("pokemonList");
const pokemonTemplate = document.getElementById("pokemonTemplate");

async function loadPokemon() {
    let ids = [];
    for (let i = 0; i < 10; i++) {
        let id = Math.floor(Math.random() * 1000) + 1;
        while (ids.includes(id)) {
            id = Math.floor(Math.random() * 1000) + 1;
        }
        ids.push(id);
    }
    for (let id of ids) {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${id}&limit=10`);
        let jsonObj = await response.json();
        let pokemon = jsonObj.results[0];
        let response2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
        let thisPokemon = await response2.json();
        for (let i = 0; i < 2; i++) {
            let newPokemon = pokemonTemplate.content.cloneNode(true);
            newPokemon.querySelector(".card-title").innerHTML = thisPokemon.name.charAt(0).toUpperCase() + thisPokemon.name.slice(1);
            newPokemon.querySelector(".card-img-top").src = thisPokemon.sprites.other['official-artwork'].front_default;
            pokemonList.appendChild(newPokemon);
        }
    }
}

function setup() {
    let firstCard;
    let secondCard;
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", e => {
            e.preventDefault();
            card.classList.toggle("flip");
            if (!firstCard) {
                firstCard = card.querySelector("img");
            } else {
                secondCard = card.querySelector("img");
                if (firstCard.src === secondCard.src) {
                    console.log("match");
                    firstCard.parentElement.removeEventListener("click", this);
                    secondCard.parentElement.removeEventListener("click", this);
                    firstCard = null;
                    secondCard = null;
                } else {
                    setTimeout(() => {
                        if (firstCard && secondCard) {
                            firstCard.parentElement.classList.toggle("flip");
                            secondCard.parentElement.classList.toggle("flip");
                            firstCard = null;
                            secondCard = null;
                        }
                    }, 800);
                }

            }
        });
    });
}

loadPokemon().then(() => {
    setup();
});
