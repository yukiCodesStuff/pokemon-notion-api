const axios = require('axios')
const { Client } = require('@notionhq/client')

const notion = new Client({
    auth: process.env.NOTION_KEY,
});

const pokeArr = []

async function getPokemon() {
    await axios.get('https://pokeapi.co/api/v2/pokemon/rayquaza')
        .then((poke) => {
            
            const pokemon = {
                "name": poke.data.species.name,
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
            console.log(pokemon)

        })
        .catch((error) => {
            console.log(error)
        })
}

getPokemon()

async function createNotionPage() {
    for (let pokemon of pokeArr) {
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
                }
            }
        })
    }
}