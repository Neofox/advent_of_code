const fs = require("fs");

const cardsStar1 = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
const cardsStar2 = ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"];
const input = fs.readFileSync("input.txt", "utf8");
const lines = input.split("\n");

/**
 *
 * @param {string} hand
 * @returns {number}
 */
const findTypeStar1 = hand => {
    let cards = new Map();
    hand.split("").forEach(card => {
        cards.set(card, (cards.get(card) || 0) + 1);
    });
    let cardType = Array.from(cards.values()).sort((a, b) => b - a);
    if (cardType[0] === 5) {
        return 6; // five of a kind
    } else if (cardType[0] === 4) {
        return 5; // four of a kind
    } else if (cardType[0] === 3 && cardType[1] === 2) {
        return 4; // full house
    } else if (cardType[0] === 3 && cardType[1] === 1) {
        return 3; // three of a kind
    } else if (cardType[0] === 2 && cardType[1] === 2) {
        return 2; // two pairs
    } else if (cardType[0] === 2 && cardType[1] === 1) {
        return 1; // one pair
    } else {
        return 0; // high card
    }
};

/**
 *
 * @param {string} hand
 * @returns {number}
 */
const findTypeStar2 = hand => {
    let cards = new Map();
    hand.split("").forEach(card => {
        cards.set(card, (cards.get(card) || 0) + 1);
    });
    jokers = cards.get("J") ? cards.get("J") : 0;
    cards.delete("J");

    let cardType = Array.from(cards.values()).sort((a, b) => b - a);
    cardType[0] = cardType[0] ? (cardType[0] += jokers) : jokers;

    if (cardType[0] === 5) {
        return 6; // five of a kind
    } else if (cardType[0] === 4) {
        return 5; // four of a kind
    } else if (cardType[0] === 3 && cardType[1] === 2) {
        return 4; // full house
    } else if (cardType[0] === 3) {
        return 3; // three of a kind
    } else if (cardType[0] === 2 && cardType[1] === 2) {
        return 2; // two pairs
    } else if (cardType[0] === 2 && cardType[1] === 1) {
        return 1; // one pair
    } else {
        return 0; // high card
    }
};

const sortByValue = (cards, handA, handB, index = 0) => {
    if (cards.indexOf(handA.split("")[index]) > cards.indexOf(handB.split("")[index])) {
        return handA;
    } else if (cards.indexOf(handA.split("")[index]) < cards.indexOf(handB.split("")[index])) {
        return handB;
    }
    return sortByValue(cards, handA, handB, index + 1);
};

const games = lines.map(line => {
    const [hand, bid] = line.split(" ");
    return { hand, bid };
});

const gamesSortedStar1 = games.slice().sort((a, b) => {
    let aValue = findTypeStar1(a.hand);
    let bValue = findTypeStar1(b.hand);
    if (aValue === bValue) {
        const biggerHand = sortByValue(cardsStar1, a.hand, b.hand);
        aValue = biggerHand === a.hand ? 10 : aValue;
        bValue = biggerHand === b.hand ? 10 : bValue;
    }
    return aValue - bValue;
});

const gamesSortedStar2 = games.slice().sort((a, b) => {
    let aValue = findTypeStar2(a.hand);
    let bValue = findTypeStar2(b.hand);
    if (aValue === bValue) {
        const biggerHand = sortByValue(cardsStar2, a.hand, b.hand);
        aValue = biggerHand === a.hand ? 10 : aValue;
        bValue = biggerHand === b.hand ? 10 : bValue;
    }
    return aValue - bValue;
});

const star1 = gamesSortedStar1.reduce((acc, game, i) => {
    const val = parseInt(game.bid) * (i + 1);

    return acc + val;
}, 0);

const star2 = gamesSortedStar2.reduce((acc, game, i) => {
    const val = parseInt(game.bid) * (i + 1);

    return acc + val;
}, 0);

console.log("star 1: ", star1);
console.log("star 2: ", star2);
