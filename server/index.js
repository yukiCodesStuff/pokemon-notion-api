const axios = require('axios')
const { Client } = require('@notionhq/client')
require('dotenv').config()

const notion = new Client({
    auth: process.env.NOTION_KEY,
});

const pokeArr = []

function capitalizeFirst(name) {
    const firstLetter = name.charAt(0)
    const remainingName = name.slice(1)
    return firstLetter.toUpperCase() + remainingName
}

async function getPokemon(pokeId) {
    await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeId}`)
        .then((poke) => {
            


            const pokemon = {
                "name": capitalizeFirst(poke.data.species.name),
                "number": poke.data.id,
                "hp": poke.data.stats[0].base_stat,
                "height": poke.data.height,
                "weight": poke.data.weight,
                "attack": poke.data.stats[1].base_stat,
                "defense": poke.data.stats[2].base_stat,
                "special-attack": poke.data.stats[3].base_stat,
                "special-defense": poke.data.stats[4].base_stat,
                "speed": poke.data.stats[5].base_stat
            }

            pokeArr.push(pokemon)
            console.log(`Fetching ${pokemon.name} from PokeAPI`)

        })
        .catch((error) => {
            console.log(error)
        })

        // createNotionPage()
}

async function createNotionPage() {
    for (let pokemon of pokeArr) {

        console.log("Sending data to Notion")

        const response = await notion.pages.create({
            "parent": {
                "type": "database_id",
                "database_id": process.env.NOTION_DATABASE_ID
            },
            "properties": {
                "Name": {
                    "title": [
                        {
                            "type": "text",
                            "text": {
                                "content": pokemon.name
                            }
                        }
                    ]
                },
                "No": {
                    "number": pokemon.number
                },
                "HP": {
                    "number": pokemon.hp
                },
                "Height": {
                    "number": pokemon.height
                },
                "Weight": {
                    "number": pokemon.weight
                },
                "Attack": {
                    "number": pokemon.attack
                },
                "Defense": {
                    "number": pokemon.defense
                },
                "Special Attack": {
                    "number": pokemon['special-attack']
                },
                "Special Defense": {
                    "number": pokemon['special-defense']
                },
                "Speed": {
                    "number": pokemon.speed
                }
            }
        })

        // console.log(response)
    }
}

// This is to ensure that createNotionPage is called only after
// al the getPokemon requests have been completed
(async () => {
    const pokemonPromises = [];
    for (let pokemonIdNum = 1; pokemonIdNum < 152; pokemonIdNum++) {
        pokemonPromises.push(getPokemon(pokemonIdNum));
    }
    await Promise.all(pokemonPromises);
    createNotionPage();
})();