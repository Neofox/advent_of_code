const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");

const extractPatterns = input => {
    const lines = input.split("\n");
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
        if (findReflection(i, i + 1, pattern, "row")) {
            return [i + 1, i + 2];
        }
    }
    return false;
};

const checkColumnReflection = pattern => {
    for (let i = 0; i < pattern[0].length - 1; i++) {
        if (findReflection(i, i + 1, pattern, "col")) {
            return [i + 1, i + 2];
        }
    }
    return false;
};

const findReflection = (indexA, indexB, pattern, mode = "row", nb = 0) => {
    const length = mode === "row" ? pattern.length : pattern[0].length;

    if (nb * 2 >= length - 1) {
        return true;
    }
    if (indexA < 0 || indexB > length - 1) {
        return nb * 2 >= 1;
    }
    const valA = mode === "row" ? pattern[indexA].join("") : pattern.map(row => row[indexA]).join("");
    const valB = mode === "row" ? pattern[indexB].join("") : pattern.map(row => row[indexB]).join("");

    if (valA === valB) {
        return findReflection(indexA - 1, indexB + 1, pattern, mode, nb + 1);
    }

    return false;
};

const patterns = extractPatterns(input);
const star1 = patterns.reduce((acc, pattern) => {
    const rowReflection = checkRowReflection(pattern);
    const columnReflection = checkColumnReflection(pattern);

    if (rowReflection) {
        acc = acc + rowReflection[0] * 100; // add number of left rows
    } else if (columnReflection) {
        acc = acc + columnReflection[0]; // add number of left columns
    }
    return acc;
}, 0);

console.log("star 1: ", star1);

// 43614

// console.log("star 2: ", star2 / 2);
