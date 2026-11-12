
const API_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemonAPI(endpoint) {
    const response = await fetch(API_URL + endpoint);

    if (!response.ok) {
        throw new Error(
            "Error fetching data from the Pokémon API: " + response.status
        );
    }

    return response.json();
}
