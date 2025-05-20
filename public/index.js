const pokemonList = document.getElementById("pokemonList");
const pokemonTemplate = document.getElementById("pokemonTemplate");
const loadingImg = document.getElementById("loading");
const timerDisplay = document.getElementById("timer");
const clicksDisplay = document.getElementById("clicks");
const scoreDisplay = document.getElementById("matches");
const matchLeftDisplay = document.getElementById("matchesLeft");
const matchStreakDisplay = document.getElementById("matchStreak");
const lightModeBtn = document.getElementById("lightMode");
const darkModeBtn = document.getElementById("darkMode");
const easySize = 3;
const mediumSize = 6;
const hardSize = 9;

var clicksMade = 0;
var timeRemaining = 0;
var timer = null;
var lastSize = easySize;
var matches = 0;
var matchesLeft = 0;
var matchesStreak = 0;

async function loadPokemon(size = easySize) {
    pokemonList.innerHTML = "";
    pokemonList.classList.add("d-none");
    clearInterval(timer);
    clicksMade = 0;
    timerDisplay.innerText = `Time Remaining: 0`;
    clicksDisplay.innerText = `Clicks Made: 0`;
    scoreDisplay.innerText = `Matches Made: 0`;
    matchLeftDisplay.innerText = `Matches Left: 0`;
    matchStreakDisplay.innerText = `Matches Streak: 0`;
    loadingImg.style.display = "block";
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
            newPokemon.querySelector(".front_face").src = thisPokemon.sprites.other['official-artwork'].front_default;
            newPokemon.id = `pokemon-${curId}`;
            pokemonList.appendChild(newPokemon);
            curId++;
        }
        await new Promise(r => setTimeout(r, 200));
    }
    for (let i = pokemonList.children.length; i >= 0; i--) {
        pokemonList.appendChild(pokemonList.children[Math.random() * i | 0]);
    }
    pokemonList.classList.remove("d-none");
    loadingImg.style.display = "none";
    clicksMade = 0;
    timeRemaining = Math.floor(size * 30);
    clicksDisplay.innerText = `Clicks Made: ${clicksMade}`;
    timerDisplay.innerText = `Time Remaining: ${timeRemaining}`;
    matchesLeft = size;
    matchesStreak = 0;
    document.getElementById("totalMatches").innerText = `Total Matches: ${size}`;
    matchLeftDisplay.innerText = `Matches Left: ${matchesLeft}`;
    timer = setInterval(() => {
        timeRemaining--;
        timerDisplay.innerText = `Time Remaining: ${timeRemaining}`;
        if (timeRemaining <= 0) {
            timerDisplay.innerText = `Time Remaining: 0`;
            clearInterval(timer);
            alert("Time's up! You lose!");
            resetBtn.click();
        }
    }, 1000);
}

function setup() {
    let firstCard;
    let secondCard;
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", async e => {
            e.preventDefault();
            if (e.target.parentElement.classList.contains("flip") || secondCard) {
                return
            }
            clicksMade++;
            clicksDisplay.innerText = `Clicks Made: ${clicksMade}`;
            card.classList.toggle("flip");

            if (!firstCard) {
                firstCard = card.querySelector(".front_face");
            } else {
                secondCard = card.querySelector(".front_face");
                if (firstCard.src === secondCard.src && firstCard !== secondCard) {
                    matches++;
                    scoreDisplay.innerText = `Matches Made: ${matches}`;
                    matchesLeft--;
                    matchLeftDisplay.innerText = `Matches Left: ${matchesLeft}`;
                    matchesStreak++;
                    firstCard = null;
                    secondCard = null;
                    if (matchesLeft <= 0) {
                        clearInterval(timer);
                        alert(`You won in ${clicksMade} clicks!`);
                        resetBtn.click();
                    } else if (matchesStreak >= 2) {
                        secondCard = 1;
                        for (card of document.querySelectorAll(".card")) {
                            card.classList.toggle("flip");
                            await new Promise(r => setTimeout(r, 200));
                        }
                        await new Promise(r => setTimeout(r, 400));
                        for (card of document.querySelectorAll(".card")) {
                            card.classList.toggle("flip");
                            await new Promise(r => setTimeout(r, 200));
                        }
                        matchesStreak = 0;
                        secondCard = undefined;
                    }
                    matchStreakDisplay.innerText = `Matches Streak: ${matchesStreak}`;
                } else {
                    matchesStreak = 0;
                    setTimeout(() => {
                        if (firstCard && secondCard) {
                            firstCard.parentElement.classList.toggle("flip");
                            secondCard.parentElement.classList.toggle("flip");
                            firstCard = null;
                            secondCard = null;
                        }
                    }, 500);
                }

            }
        });
    });
}
const easyBtn = document.getElementById("easyBtn");
const mediumBtn = document.getElementById("mediumBtn");
const hardBtn = document.getElementById("hardBtn");
const resetBtn = document.getElementById("resetBtn");
const start = document.getElementById("startBtn");
easyBtn.classList.add("active");
easyBtn.disabled = true;
easyBtn.addEventListener("click", e => {
    lastSize = easySize;
    easyBtn.classList.add("active");
    mediumBtn.classList.remove("active");
    hardBtn.classList.remove("active");
    easyBtn.disabled = true;
    mediumBtn.disabled = false;
    hardBtn.disabled = false;
});
mediumBtn.addEventListener("click", e => {
    lastSize = mediumSize;
    easyBtn.classList.remove("active");
    mediumBtn.classList.add("active");
    hardBtn.classList.remove("active");
    easyBtn.disabled = false;
    mediumBtn.disabled = true;
    hardBtn.disabled = false;
});
hardBtn.addEventListener("click", e => {
    lastSize = hardSize;
    easyBtn.classList.remove("active");
    mediumBtn.classList.remove("active");
    hardBtn.classList.add("active");
    easyBtn.disabled = false;
    mediumBtn.disabled = false;
    hardBtn.disabled = true;
});
resetBtn.addEventListener("click", e => {
    if (lastSize) {
        loadPokemon(lastSize).then(() => {
            setup();
        });
    } else {
        alert("Please select a difficulty first!");
    }
});
start.addEventListener("click", e => {
    if (lastSize) {
        loadPokemon(lastSize).then(() => {
            setup();
        });
    } else {
        alert("Please select a difficulty first!");
    }
});
lightModeBtn.disabled = true;
lightModeBtn.addEventListener("click", e => {
    document.querySelector("body").classList.remove("dark");
    lightModeBtn.disabled = true;
    darkModeBtn.disabled = false;
});

darkModeBtn.addEventListener("click", e => {
    document.querySelector("body").classList.add("dark");
    lightModeBtn.disabled = false;
    darkModeBtn.disabled = true;
});