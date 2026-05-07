const fs = require('fs');

const PATHS = {
    abilities: './data/abilities.js',
    items: './data/items.js',
    species: './data/species.js', 
    output: './data/search-index.js'
};

function rebuildSearchIndex() {
    let indexData = [];

    try {
        // 1. Pull Abilities (Checking for BattleAbilities or Abilities)
        const abilitiesFile = require(PATHS.abilities);
        const abilities = abilitiesFile.BattleAbilities || abilitiesFile.Abilities || {};
        for (const id in abilities) {
            indexData.push([id, "ability"]);
        }

        // 2. Pull Items (Checking for BattleItems or Items)
        const itemsFile = require(PATHS.items);
        const items = itemsFile.BattleItems || itemsFile.Items || {};
        for (const id in items) {
            indexData.push([id, "item"]);
        }

        // 3. Pull Species (Using BattlePokedex as you confirmed)
        const speciesFile = require(PATHS.species);
        const species = speciesFile.BattlePokedex || {};
        for (const id in species) {
            indexData.push([id, "pokemon"]);
        }

        // 4. THE FIX: Alphabetical Sorting
        // This ensures "Spicy Spray" and "Piercing Drill" land where the search expects them
        indexData.sort((a, b) => a[0].localeCompare(b[0]));

        // 5. Save in the exact [["id","type"], ...] format
        const fileContent = `exports.SearchIndex = ${JSON.stringify(indexData)};`;
        fs.writeFileSync(PATHS.output, fileContent);
        
        console.log(`Success! Indexed ${indexData.length} total entries.`);

    } catch (err) {
        console.error("Build failed: ", err.message);
        process.exit(1);
    }
}

rebuildSearchIndex();
