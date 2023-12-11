const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
const lines = input.split("\n");
const arr = lines.map(line => line.split(""));

const searchStart = arr => {
    for (let y = 0; y < arr.length; y++) {
        for (let x = 0; x < arr[y].length; x++) {
            if (arr[y][x] === "S") {
                return { x, y };
            }
        }
    }
};

/**
 *
 * @param {{x: number, y: number}} pos
 * @param {string[]} arr
 * @param {{x: number, y: number}[]} res
 * @returns {{x: number, y: number}[]}
 */
const findLoop = (pos, arr, res = []) => {
    if (res.length > 0 && arr[pos.y][pos.x] === "S") {
        return [...res, pos];
    }
    const precedentPos = res[res.length - 1];

    if (arr[pos.y][pos.x] === "S") {
        if (["-", "7", "J"].includes(arr[pos.y][pos.x + 1])) {
            return findLoop({ x: pos.x + 1, y: pos.y }, arr, [...res, pos]);
        } else if (["|", "L", "J"].includes(arr[pos.y + 1][pos.x])) {
            return findLoop({ x: pos.x, y: pos.y + 1 }, arr, [...res, pos]);
        }
    }

    if (arr[pos.y][pos.x] === "|") {
        if (precedentPos.x === pos.x && precedentPos.y === pos.y + 1) {
            return findLoop({ x: pos.x, y: pos.y - 1 }, arr, [...res, pos]);
        } else if (precedentPos.x === pos.x && precedentPos.y === pos.y - 1) {
            return findLoop({ x: pos.x, y: pos.y + 1 }, arr, [...res, pos]);
        }
    }
    if (arr[pos.y][pos.x] === "-") {
        if (precedentPos.x === pos.x - 1 && precedentPos.y === pos.y) {
            return findLoop({ x: pos.x + 1, y: pos.y }, arr, [...res, pos]);
        } else if (precedentPos.x === pos.x + 1 && precedentPos.y === pos.y) {
            return findLoop({ x: pos.x - 1, y: pos.y }, arr, [...res, pos]);
        }
    }
    if (arr[pos.y][pos.x] === "L") {
        if (precedentPos.x === pos.x && precedentPos.y === pos.y - 1) {
            return findLoop({ x: pos.x + 1, y: pos.y }, arr, [...res, pos]);
        } else if (precedentPos.x === pos.x + 1 && precedentPos.y === pos.y) {
            return findLoop({ x: pos.x, y: pos.y - 1 }, arr, [...res, pos]);
        }
    }
    if (arr[pos.y][pos.x] === "J") {
        if (precedentPos.x === pos.x && precedentPos.y === pos.y - 1) {
            return findLoop({ x: pos.x - 1, y: pos.y }, arr, [...res, pos]);
        } else if (precedentPos.x === pos.x - 1 && precedentPos.y === pos.y) {
            return findLoop({ x: pos.x, y: pos.y - 1 }, arr, [...res, pos]);
        }
    }

    if (arr[pos.y][pos.x] === "7") {
        if (precedentPos.x === pos.x - 1 && precedentPos.y === pos.y) {
            return findLoop({ x: pos.x, y: pos.y + 1 }, arr, [...res, pos]);
        } else if (precedentPos.x === pos.x && precedentPos.y === pos.y + 1) {
            return findLoop({ x: pos.x - 1, y: pos.y }, arr, [...res, pos]);
        }
    }

    if (arr[pos.y][pos.x] === "F") {
        if (precedentPos.x === pos.x && precedentPos.y === pos.y + 1) {
            return findLoop({ x: pos.x + 1, y: pos.y }, arr, [...res, pos]);
        } else if (precedentPos.x === pos.x + 1 && precedentPos.y === pos.y) {
            return findLoop({ x: pos.x, y: pos.y + 1 }, arr, [...res, pos]);
        }
    }
};

const start = searchStart(arr);
const loop = findLoop(start, arr);
const star1 = Math.floor(loop.length / 2);

// star 2
const enclosedTiles = cleanGrid => {
    const outside = [];

    // Horizontal search
    cleanGrid.forEach((row, y) => {
        let within = false;
        let up = false;

        for (let x = 0; x < row.length; x++) {
            const tile = row[x];

            if (["|"].includes(tile)) {
                within = !within;
            } else if (["L", "F"].includes(tile)) {
                up = tile === "L";
            } else if (["7", "J"].includes(tile)) {
                if (up ? tile !== "J" : tile !== "7") within = !within;
                up = false;
            }

            if (!within && tile === ".") outside.push({ x, y });
        }
    });

    return outside;
};

// Convert non-loop tiles to ground
const cleanArr = arr.map((row, y) =>
    row.map((tile, x) => {
        return loop.find(pos => pos.x === x && pos.y === y) ? tile : ".";
    })
);
const outside = enclosedTiles(cleanArr);
// I'm 1 off in my calculations... probably because loop include start twice
const star2 = arr.length * arr[0].length - new Set([...outside, ...loop]).size;

// the node process will need --stack-size=2500 to execute
console.log("star 1: ", star1);
console.log("star 2: ", star2);

// // output clean arr
// cleanArr.forEach(row => {
//     const line = row.join("") + "\n";
//     // fs.writeFileSync("output.txt", line, { flag: "a" });
//     console.log(line);
// });
