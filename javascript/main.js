
import {
    getPokemonByType,
    getPokemonWithTypes
} from "./pokemon.js";

import {
    getMoveByName,
    getWeakPokemonTypes,
    getStrongPokemonTypes
} from "./moves.js";

import { fetchPokemonAPI } from "./api.js";
import { getEvolutionAnalysis } from "./evolution.js";

const pokemonTypes = [
    "Normal", "Fire", "Water", "Electric",
    "Grass", "Ice", "Fighting", "Poison",
    "Ground", "Flying", "Psychic", "Bug",
    "Rock", "Ghost", "Dragon", "Dark",
    "Steel", "Fairy"
];

const type1 = document.getElementById("type1");
const type2 = document.getElementById("type2");

const pokemonForm = document.getElementById("pokemonForm");
const moveForm = document.getElementById("moveForm");

const pokemonResults = document.getElementById("pokemonResults");
const moveResults = document.getElementById("moveResults");

const pokemonDetailsSection = document.getElementById("pokemonDetailsSection");
const pokemonDetails = document.getElementById("pokemonDetails");
const pokemonDetailsForm = document.getElementById("pokemonDetailsForm");
const pokemonDetailsName = document.getElementById("pokemonDetailsName");

pokemonTypes.forEach(function (type) {
    const option1 = document.createElement("option");
    option1.value = type.toLowerCase();
    option1.textContent = type;
    type1.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = type.toLowerCase();
    option2.textContent = type;
    type2.appendChild(option2);
});


function renderPokemonList(pokemon) {
    const list = document.createElement("ul");

    pokemon.forEach(name => {
        const item = document.createElement("li");
        item.textContent = name;
        list.appendChild(item);
    });

    return list;
}

function makePokemonCardClickable(card, pokemonName) {
    card.style.cursor = "pointer";

    card.addEventListener("click", function () {
        showPokemonDetails(pokemonName);
    });
}

async function renderPokemonCards(pokemon) {
    const grid = document.createElement("div");
    grid.className = "pokemon-grid";

    const pokemonData = await Promise.all(
        pokemon.map(name =>
            fetchPokemonAPI("/pokemon/" + name)
        )
    );

    pokemonData.forEach(data => {
        const card = document.createElement("div");
        card.className = "pokemon-card";

        makePokemonCardClickable(card, data.name);

        const imageUrl =
            data.sprites.other["official-artwork"].front_default ||
            data.sprites.front_default;

        if (imageUrl) {
            const image = document.createElement("img");
            image.src = imageUrl;
            image.alt = data.name;

            card.appendChild(image);
        }

        const number = document.createElement("p");
        number.className = "pokemon-number";
        number.textContent =
            "#" + String(data.id).padStart(4, "0");

        const name = document.createElement("h3");
        name.textContent = data.name;

        const types = document.createElement("div");
        types.className = "pokemon-types";

        data.types.forEach(typeInfo => {
            const type = document.createElement("span");
            type.className = "pokemon-type";
            type.textContent = typeInfo.type.name;

            types.appendChild(type);
        });

        card.append(number, name, types);
        grid.appendChild(card);
    });

    return grid;
}


async function showPokemonDetails(pokemonName) {
    pokemonDetailsSection.hidden = false;
    pokemonDetails.textContent = "Loading Pokémon details...";

    try {
        const data = await fetchPokemonAPI(
            "/pokemon/" + pokemonName.toLowerCase()
        );

        pokemonDetails.replaceChildren();

        const container = document.createElement("div");
        container.className = "pokemon-details";

        const imageUrl =
            data.sprites.other["official-artwork"].front_default ||
            data.sprites.front_default;

        if (imageUrl) {
            const image = document.createElement("img");
            image.src = imageUrl;
            image.alt = data.name;
            image.className = "pokemon-details-image";
            container.appendChild(image);
        }

        const information = document.createElement("div");
        information.className = "pokemon-details-info";

        const name = document.createElement("h2");
        name.textContent = data.name;

        const number = document.createElement("p");
        number.textContent =
            "#" + String(data.id).padStart(4, "0");

        const types = document.createElement("div");
        types.className = "pokemon-types";

        data.types.forEach(typeInfo => {
            const type = document.createElement("span");
            type.className = "pokemon-type";
            type.textContent = typeInfo.type.name;
            types.appendChild(type);
        });

        const height = document.createElement("p");
        height.textContent =
            "Height: " + (data.height / 10) + " m";

        const weight = document.createElement("p");
        weight.textContent =
            "Weight: " + (data.weight / 10) + " kg";

        information.append(
            name,
            number,
            types,
            height,
            weight
        );

        container.appendChild(information);
        pokemonDetails.appendChild(container);

        const evolutionHeading = document.createElement("h3");
        evolutionHeading.textContent = "Evolution Chain";

        pokemonDetails.appendChild(evolutionHeading);

        try {
            const evolutionData = await getEvolutionAnalysis(data.name);

            for (const path of evolutionData.evolutionPaths) {
                const evolutionCards = await renderEvolutionCards(
                    path.pokemon
                );

                pokemonDetails.appendChild(evolutionCards);

                const statsHeading = document.createElement("h3");
                statsHeading.textContent = "Base Stats Comparison";

                pokemonDetails.appendChild(statsHeading);

                const statsTable = renderEvolutionStatsTable(
                    path.pokemon
                );

                pokemonDetails.appendChild(statsTable);
            }

        } catch (error) {
            console.error("Could not retrieve evolution chain:", error);

            const message = document.createElement("p");
            message.textContent = "Could not retrieve the evolution chain.";

            pokemonDetails.appendChild(message);
        }

    } catch (error) {
        console.error(error);

        pokemonDetails.textContent =
            "Could not retrieve Pokémon details.";
    }
}

function renderPokemonCombinations(combinations) {
    const container = document.createElement("div");

    if (!combinations || combinations.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No results found.";
        container.appendChild(message);
        return container;
    }

    combinations.forEach(combination => {
        const details = document.createElement("details");
        const summary = document.createElement("summary");

        summary.textContent =
            combination.types.join(" + ") +
            " (" + combination.count + " Pokémon)";

        details.appendChild(summary);
        details.appendChild(
            renderPokemonList(combination.pokemon)
        );

        container.appendChild(details);
    });

    return container;
}


async function renderEvolutionCards(pokemonList) {
    const container = document.createElement("div");
    container.className = "evolution-chain";

    const pokemonData = await Promise.all(
        pokemonList.map(pokemon =>
            fetchPokemonAPI("/pokemon/" + pokemon.name)
        )
    );

    pokemonData.forEach((data, index) => {
        const card = document.createElement("div");
        card.className = "pokemon-card evolution-card";
        
        makePokemonCardClickable(card, data.name);

        const imageUrl =
            data.sprites.other["official-artwork"].front_default ||
            data.sprites.front_default;

        if (imageUrl) {
            const image = document.createElement("img");
            image.src = imageUrl;
            image.alt = data.name;
            card.appendChild(image);
        }

        const number = document.createElement("p");
        number.className = "pokemon-number";
        number.textContent =
            "#" + String(data.id).padStart(4, "0");

        const name = document.createElement("h3");
        name.textContent = data.name;

        const types = document.createElement("div");
        types.className = "pokemon-types";

        data.types.forEach(typeInfo => {
            const type = document.createElement("span");
            type.className = "pokemon-type";
            type.textContent = typeInfo.type.name;
            types.appendChild(type);
        });


        card.append(number, name, types);
        container.appendChild(card);

        if (index < pokemonData.length - 1) {
            const arrow = document.createElement("span");
            arrow.className = "evolution-arrow";
            arrow.textContent = "→";
            container.appendChild(arrow);
        }
    });

    return container;
}

function renderEvolutionStatsTable(pokemonList) {
    const table = document.createElement("table");

    const header = document.createElement("tr");

    const statisticHeader = document.createElement("th");
    statisticHeader.textContent = "Statistic";
    header.appendChild(statisticHeader);

    for (let i = 0; i < pokemonList.length; i++) {
        const pokemonHeader = document.createElement("th");
        pokemonHeader.textContent = pokemonList[i].name;
        header.appendChild(pokemonHeader);

        if (i < pokemonList.length - 1) {
            const differenceHeader = document.createElement("th");
            differenceHeader.textContent = "Difference";
            header.appendChild(differenceHeader);
        }
    }

    table.appendChild(header);

    const stats = Object.keys(pokemonList[0].stats);

    for (const stat of stats) {
        const row = document.createElement("tr");

        const statName = document.createElement("td");
        statName.textContent = stat;
        row.appendChild(statName);

        for (let i = 0; i < pokemonList.length; i++) {
            const statValue = document.createElement("td");
            statValue.textContent = pokemonList[i].stats[stat];
            row.appendChild(statValue);

            if (i < pokemonList.length - 1) {
                const difference =
                    pokemonList[i + 1].stats[stat] -
                    pokemonList[i].stats[stat];

                const differenceCell = document.createElement("td");

                differenceCell.textContent = difference > 0
                    ? "+" + difference
                    : String(difference);

                row.appendChild(differenceCell);
            }
        }

        table.appendChild(row);
    }

    return table;
}

pokemonForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const firstType = type1.value;
    const secondType = type2.value;

    if (!firstType || !secondType) {
        alert("Select both types.");
        return;
    }

    if (firstType === secondType) {
        alert("Select two different types.");
        return;
    }

    pokemonResults.textContent = "Loading Pokémon...";

    try {
        const pokemon = await getPokemonWithTypes([
            firstType,
            secondType
        ]);

        pokemonResults.replaceChildren();

        if (pokemon.length > 0) {
            const message = document.createElement("p");

            message.textContent =
                "Found " + pokemon.length +
                " Pokémon with the types " +
                firstType + " and " + secondType + ".";

            pokemonResults.appendChild(message);
            pokemonResults.appendChild(
                await renderPokemonCards(pokemon)
            );
        } else {
            const message = document.createElement("p");

            message.textContent =
                "No Pokémon found with these two types.";

            pokemonResults.appendChild(message);
        }

    } catch (error) {
        console.error(error);

        pokemonResults.textContent =
            "An error occurred while querying the information. " +
            "Please check the URL and try again.";
    }
});


moveForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const moveName = document.getElementById("moveName")
        .value.trim().toLowerCase();

    if (!moveName) {
        alert("Enter the name of a move.");
        return;
    }

    moveResults.textContent = "Searching move...";

    try {
        const move = await getMoveByName(moveName);

        moveResults.replaceChildren();

        const properties = [
            ["Name", move.name],
            ["Type", move.type],
            ["Power", move.power ?? "N/A"],
            ["Accuracy", move.accuracy ?? "N/A"],
            ["Category", move.damageClass]
        ];

        properties.forEach(([label, value]) => {
            const paragraph = document.createElement("p");
            const strong = document.createElement("strong");

            strong.textContent = label + ": ";
            paragraph.append(strong, document.createTextNode(value));

            moveResults.appendChild(paragraph);
        });

        const actions = document.createElement("div");
        actions.className = "result-actions";

        const strongButton = document.createElement("button");
        strongButton.type = "button";
        strongButton.textContent =
            "Strong Pokémon against this move";

        strongButton.addEventListener("click", function () {
            searchWeakPokemon(move.name);
        });

        const weakButton = document.createElement("button");
        weakButton.type = "button";
        weakButton.textContent =
            "Weak Pokémon against this move";

        weakButton.addEventListener("click", function () {
            searchStrongPokemon(move.name);
        });

        actions.append(strongButton, weakButton);
        moveResults.appendChild(actions);

    } catch (error) {
        console.error(error);

        moveResults.textContent =
            "Could not retrieve the move information. " +
            "Verify the move name and try again.";
    }
});


async function searchWeakPokemon(moveName) {
    moveResults.textContent = "Loading Pokémon...";

    try {
        const result = await getWeakPokemonTypes(moveName);

        moveResults.replaceChildren();

        const move = document.createElement("p");
        move.innerHTML = "<strong>Move:</strong> ";
        move.appendChild(document.createTextNode(result.move));

        const type = document.createElement("p");
        type.innerHTML = "<strong>Type:</strong> ";
        type.appendChild(document.createTextNode(result.moveType));

        const weakTypes = document.createElement("p");
        weakTypes.innerHTML = "<strong>Weak Types:</strong> ";
        weakTypes.appendChild(
            document.createTextNode(result.weakTypes.join(", "))
        );

        moveResults.append(move, type, weakTypes);
        moveResults.appendChild(
            renderPokemonCombinations(result.pokemonByCombination)
        );

    } catch (error) {
        console.error(error);

        moveResults.textContent =
            "Could not retrieve Pokémon information. " +
            "Verify the move name and try again.";
    }
}


async function searchStrongPokemon(moveName) {
    moveResults.textContent = "Loading Pokémon...";

    try {
        const result = await getStrongPokemonTypes(moveName);

        moveResults.replaceChildren();

        const move = document.createElement("p");
        move.innerHTML = "<strong>Move:</strong> ";
        move.appendChild(document.createTextNode(result.move));

        const type = document.createElement("p");
        type.innerHTML = "<strong>Type:</strong> ";
        type.appendChild(document.createTextNode(result.moveType));

        const strongTypes = document.createElement("p");
        strongTypes.innerHTML =
            "<strong>Strong Types against this move:</strong> ";

        strongTypes.appendChild(
            document.createTextNode(result.strongTypes.join(", "))
        );

        moveResults.append(move, type, strongTypes);
        moveResults.appendChild(
            renderPokemonCombinations(result.pokemonByCombination)
        );

    } catch (error) {
        console.error(error);

        moveResults.textContent =
            "Could not retrieve Pokémon information. " +
            "Verify the move name and try again.";
    }
}


pokemonDetailsForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const pokemonName = pokemonDetailsName.value
        .trim()
        .toLowerCase();

    if (!pokemonName) {
        return;
    }

    showPokemonDetails(pokemonName);
});
