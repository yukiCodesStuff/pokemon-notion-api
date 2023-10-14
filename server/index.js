const axios = require('axios')
const { Client } = require('@notionhq/client')
require('dotenv').config()


console.log(`***API_KEY: ${process.env.NOTION_KEY}***`)
// console.log(process.env)

const notion = new Client({
    auth: process.env.NOTION_KEY,
});

// (async () => {
//     const response = await notion.search({
//       query: 'External tasks',
//       filter: {
//         value: 'database',
//         property: 'object'
//       },
//       sort: {
//         direction: 'ascending',
//         timestamp: 'last_edited_time'
//       },
//     });
//     console.log(response);
//   })();

// (async () => {
//     const databaseId = process.env.NOTION_DATABASE_ID;
//     console.log("Fetching database")
//     const response = await notion.databases.retrieve({ database_id: databaseId });
//     console.log(response);
// })();

const pokeArr = []

function capitalizeFirst(name) {
    const firstLetter = name.charAt(0)
    const remainingName = name.slice(1)
    return firstLetter.toUpperCase() + remainingName
}

async function getPokemon() {
    await axios.get('https://pokeapi.co/api/v2/pokemon/rayquaza')
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

        createNotionPage()
}

getPokemon()

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

        console.log(response)
    }
}