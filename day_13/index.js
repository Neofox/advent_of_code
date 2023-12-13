const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
const lines = input.split("\n");

const extractPatterns = input => {
    const patterns = [];
    let tempPattern = [];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] === "") {
            patterns.push(tempPattern);
            tempPattern = [];
        } else {
            tempPattern.push(lines[i].split(""));
        }
    }
    if (tempPattern.length) {
        patterns.push(tempPattern);
    }
    return patterns;
};

const checkRowReflection = pattern => {
    // TODO: can be optimized to look for middle of array to start with
    for (let i = 0; i < pattern.length - 1; i++) {
        const isReflection = findRowReflection(i, i + 1, pattern);
        // console.log(i, isReflection);

        if (isReflection) {
            return [i + 1, i + 2];
        }
    }
    return false;
};

const findRowReflection = (indexA, indexB, pattern, nb = 0) => {
    if (nb * 2 >= pattern.length - 1) {
        return true;
    }
    if (indexA < 0 || indexB > pattern.length - 1) {
        if (nb * 2 >= 1) {
            return true;
        }
        return false;
    }

    const rowA = pattern[indexA].join("");
    const rowB = pattern[indexB].join("");
    if (rowA === rowB) {
        return findRowReflection(indexA - 1, indexB + 1, pattern, nb + 1);
    }
    return false;
};

const checkColumnReflection = pattern => {
    for (let i = 0; i < pattern[0].length - 1; i++) {
        const isReflection = findColumnReflection(i, i + 1, pattern);
        // console.log(i, isReflection);

        if (isReflection) {
            return [i + 1, i + 2];
        }
    }
    return false;
};

// TODO: can be refacto with rowReflection
const findColumnReflection = (indexA, indexB, pattern, nb = 0) => {
    if (nb * 2 >= pattern[0].length - 1) {
        return true;
    }
    if (indexA < 0 || indexB > pattern[0].length - 1) {
        if (nb * 2 >= 1) {
            return true;
        }
        return false;
    }

    const colA = pattern.map(row => row[indexA]).join("");
    const colB = pattern.map(row => row[indexB]).join("");

    if (colA === colB) {
        return findColumnReflection(indexA - 1, indexB + 1, pattern, nb + 1);
    }
    return false;
};

const patterns = extractPatterns(input);
const star1 = patterns.reduce((acc, pattern) => {
    const rowReflection = checkRowReflection(pattern);
    const columnReflection = checkColumnReflection(pattern);

    if (rowReflection) {
        acc = acc + rowReflection[0] * 100; // add number of left rows
    }
    if (columnReflection) {
        acc = acc + columnReflection[0]; // add number of left columns
    }
    return acc;
}, 0);

console.log("star 1: ", star1);

// 43614

// console.log("star 2: ", star2 / 2);
