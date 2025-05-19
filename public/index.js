const pokemonList = document.getElementById("pokemonList");
const pokemonTemplate = document.getElementById("pokemonTemplate");
const pokemonGrid = document.getElementById("pokemonGrid");
const loadingImg = document.getElementById("loading");
const timerDisplay = document.getElementById("timer");
const clicksDisplay = document.getElementById("clicks");
const easySize = 9;
const mediumSize = 16;
const hardSize = 25;

var clicksMade = 0;
var timeRemaining = 0;
var timer = null;
var lastSize = null;

async function loadPokemon(size = easySize) {
    pokemonGrid.innerHTML = "";
    pokemonList.innerHTML = "";
    clearInterval(timer);
    clicksMade = 0;
    timerDisplay.innerText = `Time Remaining: 0`;
    clicksDisplay.innerText = `Clicks Made: 0`;
    loadingImg.style.display = "block";
    let rows = Math.sqrt(size);
    let ids = [];
    for (let i = 0; i < size; i++) {
        let id = Math.floor(Math.random() * 1000) + 1;
        while (ids.includes(id)) 
            id = Math.floor(Math.random() * 1000) + 1;
        ids.push(id);
    }
    let curId = 0;
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
        await new Promise(r => setTimeout(r, 200));
    }
    for (let i = pokemonList.children.length; i >= 0; i--) {
        pokemonList.appendChild(pokemonList.children[Math.random() * i | 0]);
    }
    for (let i = 0; i < rows; i++) {
        let newRow = document.createElement("div");
        newRow.classList.add("row");
        pokemonGrid.appendChild(newRow);
        for (let t = 0; t < rows; t++) {
            newRow.appendChild(pokemonList.children[i * rows + t]);
        }
    }
    pokemonList.remove();
    loadingImg.style.display = "none";
    clicksMade = 0;
    timeRemaining = Math.floor(size * size * 1.5);
    clicksDisplay.innerText = `Clicks Made: ${clicksMade}`;
    timerDisplay.innerText = `Time Remaining: ${timeRemaining}`;
    timer = setInterval(() => {
        timeRemaining--;
        timerDisplay.innerText = `Time Remaining: ${timeRemaining}`;
        if (timeRemaining <= 0) {
            clearInterval(timer);
            alert("Time's up! You lose!");
            location.reload();
        }
    }, 1000);
}

function setup() {
    let firstCard;
    let secondCard;
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", function click(e) {
            if (!card.classList.contains("flip") ) {
                return;
            }
            clicksMade++;
            clicksDisplay.innerText = `Clicks Made: ${clicksMade}`;
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
document.getElementById("easyBtn").addEventListener("click", e => {
    lastSize = easySize;
    loadPokemon(easySize).then(() => {
        setup();
    });
});
document.getElementById("mediumBtn").addEventListener("click", e => {
    lastSize = mediumSize;
    loadPokemon(mediumSize).then(() => {
        setup();
    });
});
document.getElementById("hardBtn").addEventListener("click", e => {
    lastSize = hardSize;
    loadPokemon(hardSize).then(() => {
        setup();
    });
});

document.getElementById("resetBtn").addEventListener("click", e => {
    if (lastSize) {
        loadPokemon(lastSize).then(() => {
            setup();
        });
    } else {
        alert("Please select a difficulty first!");
    }
});