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
console.log({ start, loop }, loop.length);
const star1 = Math.floor(loop.length / 2);

console.log("star 1: ", star1); // the node process will need --stack-size=2500 to execute
// console.log("star 2: ", star2);
