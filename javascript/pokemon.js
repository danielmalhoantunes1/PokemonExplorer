
import { fetchPokemonAPI } from "./api.js";

export async function getPokemonByType(type) {
    const data = await fetchPokemonAPI(
        "/type/" + type.toLowerCase()
    );

    return data.pokemon.map(entry => entry.pokemon.name);
}

export async function getPokemonWithTypes(types) {
    const pokemonLists = await Promise.all(
        types.map(type => getPokemonByType(type))
    );

    if (pokemonLists.length === 0) {
        return [];
    }

    return pokemonLists[0].filter(pokemon =>
        pokemonLists.every(list => list.includes(pokemon))
    );
}

export async function getPokemonByTypeCombinations(types) {
    const combinations = [];

    for (let i of types.keys()) {
        for (let j of types.keys()) {
            if (types.indexOf(types[i]) >= types.indexOf(types[j])) {
                continue;
            }

            const combinationTypes = [types[i], types[j]];

            const pokemon = await getPokemonWithTypes(
                combinationTypes
            );

            combinations.push({
                types: combinationTypes,
                count: pokemon.length,
                pokemon: pokemon
            });
        }
    }

    return combinations;
}
