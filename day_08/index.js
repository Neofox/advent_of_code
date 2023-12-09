const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
const lines = input.split("\n");
const moves = lines[0].split("");
const lastMoves = [];

const nextMove = (i = 0) => {
    const lastMove = lastMoves[i] ?? 0;
    const move = moves[lastMove] ?? moves[lastMove % moves.length];
    lastMoves[i] = lastMove + 1;

    return move;
};

/**
 *
 * @param {string} lines
 * @returns {Map<string, string>}
 */
const extractMap = lines => {
    const map = new Map();

    lines.forEach(line => {
        line = line.replace(/\s|\(|\)/g, "");
        const [key, paths] = line.split("=");
        map.set(key, paths.split(","));
    });

    return map;
};

const map = extractMap(lines.slice(2));

// star 1
let node = "AAA";
let star1 = 0;
while (node !== "ZZZ") {
    const next = map.get(node);
    node = nextMove() === "L" ? next[0] : next[1];
    star1++;
}

// star 2
// DISCLAIMER GCD, LCM and LCMM are grabbed from the internet

/**
 * Least common multiple (LCM) is the smallest number that is divisible by both a and b.
 * LCM = (a * b) / GCD(a, b)
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
const lcm = (a, b) => {
    return (a * b) / gcd(a, b);
};

/**
 * Least common multiple of an array of numbers.
 * @param {number[]} nums
 * @returns {number}
 */
const lcmm = nums => {
    let res = nums[0];
    for (let i = 1; i < nums.length; i++) {
        res = lcm(res, nums[i]);
    }
    return res;
};

/**
 * GCD (Greatest Common Divisor) is the largest number that divides both of the numbers.
 * @param {number} a
 * @param {number} b
 * @returns {number} GCD (Greatest Common Divisor)
 */
const gcd = (a, b) => {
    // Euclidean algorithm
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
};

let nodes = [...map.keys()].filter(node => node.endsWith("A"));
let periods = nodes.map(_ => 0);
let count = 0;
// while we haven't found a position for each end
while (!periods.every(n => n !== 0)) {
    // get new set of nodes
    nodes = nodes.map((node, i) => {
        const next = map.get(node);
        return nextMove(i) === "L" ? next[0] : next[1];
    });
    // look for nodes finishing with Z and update periods accordingly.
    // if a node finishes with Z, and its period is 0, it means it has not been visited before.
    // so we set its period to the current count.
    // this is because the period of a node is the number of moves it takes to get to it from the starting node.
    // if a node finishes with Z, and its period is not 0, it means it has been visited before.
    // so we don't need to set its period to the current count.
    nodes.forEach((node, i) => {
        if (node.endsWith("Z") && periods[i] === 0) {
            periods[i] = count;
        }
    });
    count++;
}
// periods are now the number of moves it takes to get to each node from the starting node.
periods = periods.map(n => n + 1);
const star2 = lcmm(periods);

console.log("star 1: ", star1);
console.log("star 2: ", star2);
