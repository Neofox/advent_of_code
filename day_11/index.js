const fs = require("fs");
require("util").inspect.defaultOptions.depth = 4; // increase consolelog deep

const input = fs.readFileSync("test.txt", "utf8");
const lines = input.split("\n");
const universe = lines.map(line => line.split(""));

/**
 *
 * @param {string[][]} universe
 * @returns {string[][]}
 */
const expandUniverse = (universe, expense = 1) => {
    let expandedRowsUniverse = [];
    universe.forEach((row, y) => {
        expandedRowsUniverse.push(row);
        if (row.every(cell => cell === ".")) {
            for (let i = 1; i < expense; i++) {
                expandedRowsUniverse.push(Array(universe[0].length).fill("."));
            }
        }
    });

    const columns = [];
    expandedRowsUniverse.forEach(row => {
        row.forEach((tile, x) => {
            if (!columns[x]) columns[x] = [];
            columns[x].push(tile);
        });
    });

    const expandedUniverse = expandedRowsUniverse.map(row => {
        newRow = [];
        row.forEach((tile, i) => {
            newRow.push(tile);
            if (columns[i].every(cell => cell === ".")) {
                for (let i = 1; i < expense; i++) {
                    newRow.push(".");
                }
            }
        });

        return newRow;
    });

    return expandedUniverse;
};

/**
 *
 * @param {string[][]} universe
 * @returns {{x: number, y: number}[]}
 */
const findGalaxies = universe => {
    const galaxies = [];

    universe.forEach((row, y) => {
        row.forEach((tile, x) => {
            if (tile === "#") {
                galaxies.push({ x, y });
            }
        });
    });

    return galaxies;
};

/**
 *
 * @param {{x: number, y: number}} galaxyA
 * @param {{x: number, y: number}} galaxyB
 * @returns {number}
 */
const findDistanceBetweenGalaxies = (galaxyA, galaxyB) => {
    return Math.abs(galaxyA.x - galaxyB.x) + Math.abs(galaxyA.y - galaxyB.y);
};

const expandedUniverse = expandUniverse(universe);
const galaxies = findGalaxies(expandedUniverse);

// this add doubles (when galaxyA is galaxyB) so result should be divided by two
const galaxiesPairs = galaxies
    .map(galaxy => {
        const pairs = [];
        galaxies.forEach(galaxy2 => {
            if (galaxy === galaxy2) return;
            pairs.push({ galaxyA: galaxy, galaxyB: galaxy2 });
        });
        return pairs;
    })
    .flat();

const star1 = galaxiesPairs.reduce((prev, pair) => {
    return prev + findDistanceBetweenGalaxies(pair.galaxyA, pair.galaxyB);
}, 0);

console.log("star 1: ", star1 / 2);

const expandedUniverseStar2 = expandUniverse(universe, 100);
const galaxiesStar2 = findGalaxies(expandedUniverseStar2);

// this add doubles (when galaxyA is galaxyB) so result should be divided by two
const galaxiesPairsStar2 = galaxiesStar2
    .map(galaxy => {
        const pairs = [];
        galaxiesStar2.forEach(galaxy2 => {
            if (galaxy === galaxy2) return;
            pairs.push({ galaxyA: galaxy, galaxyB: galaxy2 });
        });
        return pairs;
    })
    .flat();

const star2 = galaxiesPairsStar2.reduce((prev, pair) => {
    return prev + findDistanceBetweenGalaxies(pair.galaxyA, pair.galaxyB);
}, 0);
console.log("star 2: ", star2 / 2);
