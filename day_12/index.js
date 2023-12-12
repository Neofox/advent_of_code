const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
const lines = input.split("\n");

const data = lines.map(line => {
    let [springs, records] = line.split(" ");
    springs = springs.split("");
    records = records.split(",").map(Number);

    return { springs, records };
});

/**
 *
 * @param {string[]} springs ['#','.','#','.','#','#','#']
 * @returns {number[]} [1,1,3]
 */
const findGroupsOfDamagedSpring = springs => {
    const groups = [];
    let group = 0;
    springs.forEach(spring => {
        if (spring === "#") {
            group += 1;
        } else if (group > 0) {
            groups.push(group);
            group = 0;
        }
    });
    if (group > 0) {
        groups.push(group);
    }

    return groups;
};

/**
 *
 * @param {string[]} springs ['?','?','?','.','#','#','#']
 * @returns {string[][]} [['#','?','?','.','#','#','#'], ['#','#','?','.','#','#','#'], ['#','?','#','.','#','#','#'], ['#','#','#','.','#','#','#'], ['?','#','?','.','#','#','#'], ['?','#','#','.','#','#','#'], , ['?','?','#','.','#','#','#']]
 */
const replaceUnknownSprings = springs => {
    const springsGroups = [];
    const indexOfUnknowSprings = [];
    springs.forEach((spring, index) => {
        if (spring === "?") {
            indexOfUnknowSprings.push(index);
        }
    });

    const recurse = (current = "") => {
        if (current.length === indexOfUnknowSprings.length) {
            springsGroups.push(current);
            return;
        }

        for (let char of [".", "#"]) {
            recurse(current + char);
        }
    };

    recurse();
    return springsGroups.map(springsGroup => {
        let res = [...springs];
        const springGroups = springsGroup.split("");
        indexOfUnknowSprings.forEach((index, i) => {
            res[index] = springGroups[i];
        });
        return res;
    });
};

const star1 = data.reduce((acc, { springs, records }) => {
    const groups = replaceUnknownSprings(springs);
    const res = groups.filter(group => {
        const damagedSprings = findGroupsOfDamagedSpring(group);
        return JSON.stringify(damagedSprings) === JSON.stringify(records);
    });
    const numberOfMatchGroups = res.length;

    return acc + numberOfMatchGroups;
}, 0);

console.log("star 1: ", star1);
// console.log("star 2: ", star2);
