const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
const lines = input.split("\n");

// star 1
const timesStar1 = lines[0].split(":")[1].trim().split(/\s+/).map(Number);
const distancesStar1 = lines[1].split(":")[1].trim().split(/\s+/).map(Number);
const racesStar1 = timesStar1.map((time, i) => ({ time, distance: distancesStar1[i] }));

// star 2
const timeStar2 = parseInt(lines[0].split(":")[1].trim().replace(/\s+/g, ""));
const distanceStar2 = parseInt(lines[1].split(":")[1].trim().replace(/\s+/g, ""));
const raceStar2 = { time: timeStar2, distance: distanceStar2 };

const calculateNumberOfWinningCombination = race => {
    let winningSolution = 0;
    for (let timePressed = 0; timePressed < race.time; timePressed++) {
        const movedDistance = timePressed * (race.time - timePressed);

        if (movedDistance > race.distance) {
            winningSolution++;
        }
    }
    return winningSolution;
};

const star1 = racesStar1.reduce((prev, curr) => {
    const winningSolutions = calculateNumberOfWinningCombination(curr);
    return prev * winningSolutions;
}, 1);

const star2 = calculateNumberOfWinningCombination(raceStar2);

console.log("star 1: ", star1);
console.log("star 2: ", star2);
