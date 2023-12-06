const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
const lines = input.split("\n");
const maps = lines.slice(2);

// star 1
const seeds = lines[0].split(":")[1].trim().split(" ").map(Number);

// star 2
let seedsRange = seeds
    .map((element, index, numbers) => {
        let res = [];
        if (index % 2 === 0) {
            res = [element, numbers[index + 1]];
        }
        return res;
    })
    .filter(element => element.length > 0);

console.log({ seeds, seedsRange });

/**
 *
 * @param {string} name seed-to-soil
 * @returns {number[][]}
 */
const extractMap = name => {
    const mapStart = maps.findIndex(m => m.includes(`${name} map`));

    if (mapStart === -1) {
        throw new Error("map not found");
    }

    let lookedIndex = mapStart + 1;
    let res = [];
    while (maps[lookedIndex] !== "") {
        let [dest_start, src_start, length] = maps[lookedIndex].split(" ").map(Number);
        res.push({ dest_start, src_start, length });
        lookedIndex++;
    }

    return res;
};

/**
 * @param {number} seed
 * @returns {number}
 */
const convertSeed = (seed, map) => {
    let res = seed;

    map.forEach(({ dest_start, src_start, length }) => {
        // don't make useless calculation
        if (res !== seed) {
            return;
        }

        // don't make useless calculation
        if (seed < src_start || seed >= src_start + length) {
            return;
        }

        const diff = seed - src_start;
        res = dest_start + diff;
    });

    return res;
};

/**
 * @param {number} seed
 * @returns {number}
 */
const convertSeedReverse = (seed, map) => {
    let res = seed;

    map.forEach(({ dest_start, src_start, length }) => {
        // don't make useless calculation
        if (res !== seed) {
            return;
        }

        // don't make useless calculation
        if (seed < dest_start || seed >= dest_start + length) {
            return;
        }

        const diff = seed - dest_start;
        res = src_start + diff;
    });

    return res;
};

const convertSeedThroughAllMap = seed => {
    const soil = convertSeed(seed, extractMap("seed-to-soil"));
    const fertilizer = convertSeed(soil, extractMap("soil-to-fertilizer"));
    const water = convertSeed(fertilizer, extractMap("fertilizer-to-water"));
    const light = convertSeed(water, extractMap("water-to-light"));
    const temperature = convertSeed(light, extractMap("light-to-temperature"));
    const humidity = convertSeed(temperature, extractMap("temperature-to-humidity"));
    const location = convertSeed(humidity, extractMap("humidity-to-location"));

    return location;
};

const searchSeed = location => {
    const humidity = convertSeedReverse(location, extractMap("humidity-to-location"));
    const temperature = convertSeedReverse(humidity, extractMap("temperature-to-humidity"));
    const light = convertSeedReverse(temperature, extractMap("light-to-temperature"));
    const water = convertSeedReverse(light, extractMap("water-to-light"));
    const fertilizer = convertSeedReverse(water, extractMap("fertilizer-to-water"));
    const soil = convertSeedReverse(fertilizer, extractMap("soil-to-fertilizer"));
    const seed = convertSeedReverse(soil, extractMap("seed-to-soil"));

    res = seedsRange.some(range => {
        const [min, length] = range;

        if (seed < min || seed >= min + length) {
            return false;
        }

        res = seed >= min && seed <= min + length - 1;

        if (res) {
            console.log({ range });
        }

        return res;
    });

    if (res) {
        console.log({ location, seed });
    }

    return res;
};

const star1 = seeds.reduce((prev, curr) => {
    const location = convertSeedThroughAllMap(curr);

    return Math.min(prev, location);
}, Infinity);

// I used that for running multiple processes to parrallelize the brut force search
const startLocation = 95_000_000;
const maxLocation = 100_000_000;
const step = 2;

let star2 = startLocation;
let isfoundSeed = false;
while (!isfoundSeed && star2 <= maxLocation) {
    isfoundSeed = searchSeed(star2);
    star2 += step; // finding the result one off
}

console.log("star 1: ", star1);

if (star2 == maxLocation + step) {
    console.error(`star 2: no smallest location found (${startLocation} to ${maxLocation} with step ${step})`);
} else {
    console.log("star 2: ", star2 - step);
}
