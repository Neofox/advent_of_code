const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
const searchedMaxBalls = { blue: 14, red: 12, green: 13 };

/**
 *
 * @param {string} game 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
 * @returns {Object} {blue: 6, red: 4, green: 2}
 */
const extractMaxBallsFromGame = game => {
    const pulls = game.split(";");
    const balls = pulls.map(pull => {
        const ballsTry = pull.trim().split(",");
        let res = { blue: 0, red: 0, green: 0 };

        ballsTry.forEach(ball => {
            const [count, color] = ball.trim().split(" ");
            res[color] = parseInt(count);
        });

        return res;
    });

    const maxBalls = balls.reduce(
        (prev, curr) => {
            if (prev.blue < curr.blue) prev.blue = curr.blue;
            if (prev.red < curr.red) prev.red = curr.red;
            if (prev.green < curr.green) prev.green = curr.green;

            return prev;
        },
        { blue: 0, red: 0, green: 0 }
    );
    return maxBalls;
};

const formatGame = game => {
    const [gameId, gameTries] = game.split(":");
    const maxBalls = extractMaxBallsFromGame(gameTries.trim());
    const id = parseInt(gameId.slice(5));

    return { id, max: maxBalls };
};

const games = input.split("\n");
const formatedGames = games.map(formatGame);

// star 1
const filteredGames = formatedGames.filter(
    game =>
        game.max.blue <= searchedMaxBalls.blue &&
        game.max.red <= searchedMaxBalls.red &&
        game.max.green <= searchedMaxBalls.green
);

const star1 = filteredGames.reduce((prev, curr) => {
    return prev + curr.id;
}, 0);

// star 2
const star2 = formatedGames.reduce((prev, curr) => {
    const power = curr.max.blue * curr.max.red * curr.max.green;
    return prev + power;
}, 0);

console.log("star 1: ", star1);
console.log("star 2: ", star2);
