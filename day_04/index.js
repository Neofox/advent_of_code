const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
const lines = input.split("\n");

/**
 *
 * @param {string} card "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53"
 * @returns {object} {winning: number[], owned: number[]}
 */
const extractWinningAndOwnNumbers = card => {
    let [id, game] = card.split(":");
    game = game.trim();
    id = parseInt(id.trim().slice(5));
    let [winning, owned] = game.split("|");
    winning = winning.trim().split(" ").filter(Boolean).map(Number);
    owned = owned.trim().split(" ").filter(Boolean).map(Number);

    return { id, winning, owned };
};

const searchWonNumbers = (winning, owned) => {
    return owned.filter(n => winning.includes(n));
};

const calculatePoints = wonNumbers => {
    return wonNumbers.reduce((prev, curr) => {
        if (prev === 0) {
            return 1;
        }
        return prev * 2;
    }, 0);
};

const formatedCards = lines.map(extractWinningAndOwnNumbers);

const points = formatedCards.map(({ winning, owned }) => {
    const wonNumbers = searchWonNumbers(winning, owned);
    return calculatePoints(wonNumbers);
});

// show debug data
let logData = [];
formatedCards.forEach(({ id, winning, owned }) => {
    const wonNumbers = searchWonNumbers(winning, owned);
    const points = calculatePoints(wonNumbers);
    logData.push({ id, "won numbers": wonNumbers, points, owned, winning });
});
console.table(logData);
// end show debug data

const star1 = points.reduce((prev, curr) => prev + curr, 0);

console.log("star 1: ", star1);

let scratchcards = [];
let precedentCopy = [...formatedCards];
while (precedentCopy.length > 0) {
    let tempScratchCards = [];
    precedentCopy.forEach(({ id, winning, owned }) => {
        const wonNumbersTotal = searchWonNumbers(winning, owned).length;
        for (let i = 1; i <= wonNumbersTotal; i++) {
            const searchCard = formatedCards.find(c => c.id === id + i);
            tempScratchCards.push(searchCard);
        }
    });
    scratchcards = [...scratchcards, ...precedentCopy];
    precedentCopy = [...tempScratchCards];
}

console.log(
    "scratchcards: ",
    scratchcards.sort((a, b) => a.id - b.id).map(c => c.id)
);
const star2 = scratchcards.length;
console.log("star 2: ", star2);
