
import {
    getPokemonByType,
    getPokemonWithTypes
} from "./pokemon.js";

import {
    getMoveByName,
    getWeakPokemonTypes,
    getStrongPokemonTypes
} from "./moves.js";

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
const singleType = document.getElementById("singleType");

const pokemonForm = document.getElementById("pokemonForm");
const singleTypeForm = document.getElementById("singleTypeForm");
const moveForm = document.getElementById("moveForm");
const evolutionForm = document.getElementById("evolutionForm");

const pokemonResults = document.getElementById("pokemonResults");
const singleTypeResults = document.getElementById("singleTypeResults");
const moveResults = document.getElementById("moveResults");
const evolutionResults = document.getElementById("evolutionResults");

// Populate Pokémon type selectors

pokemonTypes.forEach(function (type) {
    const option1 = document.createElement("option");
    option1.value = type.toLowerCase();
    option1.textContent = type;
    type1.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = type.toLowerCase();
    option2.textContent = type;
    type2.appendChild(option2);

    const option3 = document.createElement("option");
    option3.value = type.toLowerCase();
    option3.textContent = type;
    singleType.appendChild(option3);
});

// Display a list of Pokémon

function renderPokemonList(pokemon) {
    const list = document.createElement("ul");

    pokemon.forEach(name => {
        const item = document.createElement("li");
        item.textContent = name;
        list.appendChild(item);
    });

    return list;
}

// Display Pokémon type combinations

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

// Search Pokémon by two types

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
                renderPokemonList(pokemon)
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

// Search Pokémon by one type

singleTypeForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const selectedType = singleType.value;

    if (!selectedType) {
        return;
    }

    singleTypeResults.textContent = "Loading Pokémon...";

    try {
        const pokemon = await getPokemonByType(selectedType);

        singleTypeResults.replaceChildren();

        if (pokemon.length > 0) {
            const message = document.createElement("p");

            message.textContent =
                "Found " + pokemon.length +
                " Pokémon of type " + selectedType + ".";

            singleTypeResults.appendChild(message);
            singleTypeResults.appendChild(
                renderPokemonList(pokemon)
            );
        } else {
            const message = document.createElement("p");

            message.textContent =
                "No Pokémon found with this type.";

            singleTypeResults.appendChild(message);
        }

    } catch (error) {
        console.error(error);

        singleTypeResults.textContent =
            "An error occurred while querying the information. " +
            "Please check the URL and try again.";
    }
});

// Search move information

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

// Search Pokémon weak against a move

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

// Search Pokémon strong against a move

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

// Analyze Pokémon evolution chain

evolutionForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const pokemon = document
        .getElementById("evolutionPokemon")
        .value
        .trim()
        .toLowerCase();

    if (!pokemon) {
        return;
    }

    evolutionResults.textContent = "Analyzing evolution chain...";

    try {
        const result = await getEvolutionAnalysis(pokemon);

        evolutionResults.replaceChildren();

        for (const path of result.evolutionPaths) {
            const heading = document.createElement("h2");
            heading.textContent = "Evolution Chain";

            const chain = document.createElement("p");

            const chainLabel = document.createElement("strong");
            chainLabel.textContent = "Chain: ";

            chain.append(
                chainLabel,
                document.createTextNode(
                    path.pokemon.map(p => p.name).join(" → ")
                )
            );

            evolutionResults.append(heading, chain);

            const pokemonList = path.pokemon;

            if (pokemonList.length === 1) {
                const message = document.createElement("p");

                message.textContent =
                    "This Pokémon has no evolutions registered in this chain.";

                evolutionResults.appendChild(message);
            }

            const table = document.createElement("table");

            const header = document.createElement("tr");

            const statisticHeader = document.createElement("th");
            statisticHeader.textContent = "Statistic";
            header.appendChild(statisticHeader);

            for (let i of pokemonList.keys()) {
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

                for (let i of pokemonList.keys()) {
                    const statValue = document.createElement("td");
                    statValue.textContent = pokemonList[i].stats[stat];
                    row.appendChild(statValue);

                    if (i < pokemonList.length - 1) {
                        const difference =
                            pokemonList[i + 1].stats[stat] -
                            pokemonList[i].stats[stat];

                        const formattedDifference = difference > 0
                            ? "+" + difference
                            : String(difference);

                        const differenceCell = document.createElement("td");
                        differenceCell.textContent = formattedDifference;
                        row.appendChild(differenceCell);
                    }
                }

                table.appendChild(row);
            }

            evolutionResults.appendChild(table);
        }

    } catch (error) {
        console.error(error);

        evolutionResults.textContent =
            "Could not retrieve the evolution chain. " +
            "Verify the Pokémon name and try again.";
    }
});
