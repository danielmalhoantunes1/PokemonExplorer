
import { fetchPokemonAPI } from "./api.js";
import { getPokemonByTypeCombinations } from "./pokemon.js";

export async function getMoveByName(name) {
    const data = await fetchPokemonAPI(
        "/move/" + name.toLowerCase()
    );

    return {
        name: data.name,
        type: data.type.name,
        power: data.power,
        accuracy: data.accuracy,
        damageClass: data.damage_class.name
    };
}

export async function getWeakPokemonTypes(moveName) {
    const move = await getMoveByName(moveName);

    const typeData = await fetchPokemonAPI(
        "/type/" + move.type
    );

    const weakTypes = typeData.damage_relations.double_damage_to
        .map(type => type.name);

    const pokemonByCombination =
        await getPokemonByTypeCombinations(weakTypes);

    return {
        move: move.name,
        moveType: move.type,
        weakTypes: weakTypes,
        pokemonByCombination: pokemonByCombination
    };
}

export async function getStrongPokemonTypes(moveName) {
    const move = await getMoveByName(moveName);

    const typeData = await fetchPokemonAPI(
        "/type/" + move.type
    );

    const strongTypes = typeData.damage_relations.half_damage_to
        .map(type => type.name);

    const pokemonByCombination =
        await getPokemonByTypeCombinations(strongTypes);

    return {
        move: move.name,
        moveType: move.type,
        strongTypes: strongTypes,
        pokemonByCombination: pokemonByCombination
    };
}
