
import { fetchPokemonAPI } from "./api.js";

export async function getEvolutionAnalysis(name) {
    const species = await fetchPokemonAPI(
        "/pokemon-species/" + name.toLowerCase()
    );

    const chainResponse = await fetch(
        species.evolution_chain.url
    );

    if (!chainResponse.ok) {
        throw new Error("Could not fetch evolution chain.");
    }

    const chainData = await chainResponse.json();

    function getEvolutionPaths(node, currentPath = []) {
        const newPath = [
            ...currentPath,
            node.species.name
        ];

        if (node.evolves_to.length === 0) {
            return [newPath];
        }

        let paths = [];

        for (const evolution of node.evolves_to) {
            paths = paths.concat(
                getEvolutionPaths(evolution, newPath)
            );
        }

        return paths;
    }

    const paths = getEvolutionPaths(chainData.chain);

    const pokemonData = {};

    for (const path of paths) {
        for (const pokemonName of path) {
            if (!pokemonData[pokemonName]) {
                const pokemon = await fetchPokemonAPI(
                    "/pokemon/" + pokemonName
                );

                const stats = {};

                for (const stat of pokemon.stats) {
                    stats[stat.stat.name] = stat.base_stat;
                }

                pokemonData[pokemonName] = {
                    name: pokemon.name,
                    types: pokemon.types.map(
                        t => t.type.name
                    ),
                    stats: stats
                };
            }
        }
    }

    const evolutionPaths = paths.map(path => {
        const evolutions = path.map(pokemonName =>
            pokemonData[pokemonName]
        );

        const comparisons = [];

        for (let i of evolutions.keys()) {
            if (i === 0) continue;

            const previous = evolutions[i - 1];
            const current = evolutions[i];

            const differences = {};

            for (const stat in previous.stats) {
                differences[stat] =
                    current.stats[stat] - previous.stats[stat];
            }

            comparisons.push({
                from: previous.name,
                to: current.name,
                differences: differences
            });
        }

        return {
            pokemon: evolutions,
            comparisons: comparisons
        };
    });

    return {
        requestedPokemon: name.toLowerCase(),
        evolutionPaths: evolutionPaths
    };
}
