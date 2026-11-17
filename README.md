# Pokémon Explorer

## Project Description

Pokémon Explorer is a static website that allows users to explore Pokémon information through the PokéAPI. The application provides an interactive way to discover Pokémon, explore their types, analyse their moves and compare evolutionary statistics.

The website is built using HTML, CSS and JavaScript, without external frameworks or libraries.

## Features

### Pokémon Details
- Search for a Pokémon and display its information, including its Pokédex number, types, height, weight and description.
- Explore a Pokémon's evolution chain and compare base stats between evolutionary stages.

### Pokémon by Two Types
- Find Pokémon that have both selected types.

### Move Search
- Identify Pokémon both types that receive double damage or half damage from a given move, and explore Pokémon with those type combinations.

### Interface and Design
- Interactive Pokémon cards with hover effects.
- Smooth scrolling when selecting Pokémon cards.
- Pokémon appearance animation in the details section.
- Navigation menu for accessing the different sections.

### No external JavaScript frameworks or libraries are used.

## Project Structure

```text
PokemonExplorer/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
└── javascript/
    ├── api.js
    ├── main.js
    ├── pokemon.js
    ├── moves.js
    └── evolution.js
```

### JavaScript Modules

| File | Description |
|---|---|
| `api.js` | Handles requests to the PokéAPI and processes API responses. |
| `main.js` | Coordinates the application, manages user interactions and dynamically renders content. |
| `pokemon.js` | Retrieves Pokémon by type and identifies Pokémon with two selected types. |
| `moves.js` | Retrieves move information and analyses Pokémon types that are strong or weak against a move. |
| `evolution.js` | Retrieves and analyses Pokémon evolution chains. |

## API

This project uses the [PokéAPI](https://pokeapi.co/), a free and public RESTful API that provides information about Pokémon.

The application retrieves data dynamically through HTTP requests using JavaScript's `fetch()` method.

No API key is required.

## Running the Project Locally

1. Clone or download the project repository.

2. Open a terminal in the project's root directory.

3. Start a local HTTP server using Python:

   ```bash
   python -m http.server 8000
   ```

4. Open the following address in your browser:

   ```text
   http://localhost:8000
   ```

5. Explore the different sections of Pokémon Explorer.

### Requirements

- Python 3 installed, or another local HTTP server.
- Internet connection to retrieve information from the PokéAPI.


## Credits

- Pokémon information and data provided by [PokéAPI](https://pokeapi.co/).
- Pokémon names, characters and related content belong to their respective owners.
- Background image in ```/images```
