const fs = require("fs");

const mapNumberInTextToDigit = text => {
    return text
        .replace(/zero/gi, "z0o")
        .replace(/one/gi, "o1e")
        .replace(/two/gi, "t2o")
        .replace(/three/gi, "t3e")
        .replace(/four/gi, "f4r")
        .replace(/five/gi, "f5e")
        .replace(/six/gi, "s6x")
        .replace(/seven/gi, "s7n")
        .replace(/eight/gi, "e8t")
        .replace(/nine/gi, "n9e");
};

const extractNumbersFromString = str => {
    const numbers = str.match(/\d+/g);
    return numbers ? numbers.map(Number) : [];
};

const getFirstAndLastDigit = numbers => {
    if (!numbers || !numbers.length) return 0;

    const firstNumber = numbers[0];
    const lastNumber = numbers[numbers.length - 1];

    const firstDigit = firstNumber.toString()[0];
    const lastDigit = lastNumber.toString()[lastNumber.toString().length - 1];

    return parseInt(`${firstDigit}${lastDigit}`);
};

const input = fs.readFileSync("input.txt", "utf8");
const lines = input.split("\n");

// star 1
const star1 = lines
    .map(line => {
        const numbers = extractNumbersFromString(line);
        return getFirstAndLastDigit(numbers);
    })
    .reduce((previous, current) => {
        return previous + current;
    }, 0);

// star 2
const star2 = lines
    .map(line => {
        const newLine = mapNumberInTextToDigit(line); // star 2
        const numbers = extractNumbersFromString(newLine);
        return getFirstAndLastDigit(numbers);
    })
    .reduce((previous, current) => {
        return previous + current;
    }, 0);

console.log("star 1: ", star1);
console.log("star 2: ", star2);
