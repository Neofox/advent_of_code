const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
const lines = input.split("\n");

const values = lines.map(line => line.split(" ").map(Number));

/**
 *
 * @param {number[]} value
 * @param {number[][]} temp
 * @returns {number[][]}
 */
const getDifference = (value, temp = []) => {
    temp.push(value);

    if (value.every(val => val === 0)) {
        return temp;
    }

    let res = [];
    for (let i = 0; i < value.length - 1; i++) {
        const a = value[i];
        const b = value[i + 1];
        res[i] = b - a;
    }

    return getDifference(res, temp);
};

const getNextHistoryValue = histories => {
    let nextHistoryValue = 0;
    for (let i = 1; i < histories.length; i++) {
        const history = histories[i];
        const lastHistoryValue = history[history.length - 1];
        nextHistoryValue = nextHistoryValue + lastHistoryValue;
    }

    return nextHistoryValue;
};

const getFirstHistoryValue = histories => {
    let nextHistoryValue = 0;
    for (let i = 1; i < histories.length; i++) {
        const history = histories[i];
        const firstHistoryValue = history[0];
        nextHistoryValue = firstHistoryValue - nextHistoryValue;
    }

    return nextHistoryValue;
};

const star1 = values.reduce((prev, curr) => {
    const diff = getDifference(curr).sort((a, b) => a.length - b.length);
    return prev + getNextHistoryValue(diff);
}, 0);

const star2 = values.reduce((prev, curr) => {
    const diff = getDifference(curr).sort((a, b) => a.length - b.length);
    return prev + getFirstHistoryValue(diff);
}, 0);

console.log("star 1: ", star1);
console.log("star 2: ", star2);
