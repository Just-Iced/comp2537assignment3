const pokemonList = document.getElementById("pokemonList");
const pokemonTemplate = document.getElementById("pokemonTemplate");
var pageNum = 0;
async function loadPokemon() {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${pageNum * 10}&limit=10`);
    let jsonObj = await response.json();
    for (let pokemon of jsonObj.results) {
        let response2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
        let thisPokemon = await response2.json();
        for (let i = 0; i < 2; i++) {
            let newPokemon = pokemonTemplate.content.cloneNode(true);
            newPokemon.querySelector(".card-title").innerHTML = thisPokemon.name.charAt(0).toUpperCase() + thisPokemon.name.slice(1);
            newPokemon.querySelector(".card-img-top").src = thisPokemon.sprites.other['official-artwork'].front_default;
            await pokemonList.appendChild(newPokemon);
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
                        firstCard.parentElement.classList.toggle("flip");
                        secondCard.parentElement.classList.toggle("flip");
                        firstCard = null;
                        secondCard = null;
                    }, 1000);
                }

            }
        });
    });
}

loadPokemon().then(() => {
    setup();
});
