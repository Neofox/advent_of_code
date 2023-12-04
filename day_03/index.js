const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");

const extractNonAlphanumeric = str => {
    return str.match(/[^\w\s\.]/g).join("");
};

const create2Darray = input => {
    const lines = input.split("\n");
    return lines.map(line => line.split("").map(c => (isNaN(Number(c)) ? c : Number(c))));
};

const arr = create2Darray(input);

const findNumberPosition = arr => {
    let positions = [];
    arr.forEach((element, lineIndex) => {
        element.forEach((c, index) => {
            if (isNaN(c)) {
                return;
            }
            const [x, y] = [index, lineIndex];
            positions.push({ x, y });
        });
    });
    return positions;
};

const findSymbolPosition = (arr, symbols = null) => {
    symbols = symbols ?? [...extractNonAlphanumeric(input)];

    let positions = [];
    arr.forEach((element, lineIndex) => {
        element.forEach((c, index) => {
            if (symbols.includes(c)) {
                const [x, y] = [index, lineIndex];
                positions.push({ x, y });
            }
        });
    });
    return positions;
};

/**
 * 
 * @param {Array} numberPositions [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    ...
    ]
 * @param {*} symbolPosition [
    { x: 3, y: 1 },
    { x: 6, y: 3 },
    ...
    ]
 */
const findNumberCloseToSymbols = (numberPositions, symbolPositions) => {
    return numberPositions.filter(number => {
        return symbolPositions.some(symbol => {
            return Math.abs(symbol.x - number.x) <= 1 && Math.abs(symbol.y - number.y) <= 1;
        });
    });
};

const findNumbersCloseToSymbol = (symbolPosition, numberPositions) => {
    return numberPositions.filter(number => {
        return Math.abs(symbolPosition.x - number.x) <= 1 && Math.abs(symbolPosition.y - number.y) <= 1;
    });
};

/**
 *
 * @param {Array} arr
 * @param {Object} position {x: 2, y: 0}
 * @returns 467
 */
const getFullNumberFromDigitPosition = (arr, position) => {
    const line = [...arr[position.y]];
    let numbersInLine = [];
    let numbers = "";
    let indexes = [];

    for (let i = 0; i <= line.length; i++) {
        if (!isNaN(line[i])) {
            // create the full number
            numbers += line[i];
            indexes.push(i);
        } else {
            // if it's an other character, end the number and start a new one
            if (numbers.length > 0 && indexes.includes(position.x)) {
                numbersInLine.push(parseInt(numbers));
            }
            numbers = "";
            indexes = [];
        }
    }
    if (numbersInLine.length > 0) {
        return numbersInLine[0];
    }
    throw new Error({ line: line, lineIndex: position.y });
};

const numberPositions = findNumberPosition(arr);
const symbolPositions = findSymbolPosition(arr);
const numbersCloseToSymbols = findNumberCloseToSymbols(numberPositions, symbolPositions);

const star1 = numbersCloseToSymbols.reduce(
    (prev, curr) => {
        const number = getFullNumberFromDigitPosition(arr, curr);

        if (prev.prev === number) {
            return prev;
        } else {
        }

        return { prev: number, sum: prev.sum + number };
    },
    { prev: 0, sum: 0 }
);

const findRatioOfStar = (numberPositions, starPosition) => {
    const digitTouchingTheStar = findNumbersCloseToSymbol(starPosition, numberPositions);
    const n = digitTouchingTheStar.map(digit => {
        return getFullNumberFromDigitPosition(arr, digit);
    });
    const uniqueNumbers = [...new Set(n)];

    if (uniqueNumbers.length === 2) {
        return uniqueNumbers[0] * uniqueNumbers[1];
    }
    return 0;
};

const symbolPositionsStar2 = findSymbolPosition(arr, ["*"]);

const star2 = symbolPositionsStar2.reduce((prev, curr) => {
    // console.log("star:", curr);
    // console.log("ratio:", findRatioOfStar(numberPositions, curr));

    return prev + findRatioOfStar(numberPositions, curr);
}, 0);

console.log("star 1: ", star1.sum);
console.log("star 2: ", star2);
