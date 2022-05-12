let Simulator = require("./DuelSim");
let fs = require("fs");

let fileContent = fs.readFileSync("./exampleUnit.json", 'utf-8');
let unit1 = JSON.parse(fileContent);
let unit2 = JSON.parse(fileContent);

let duel = new Simulator.DuelSim(unit1,unit2);
console.log(duel.progressDuel());
console.log(duel.progressDuel());
console.log(duel.progressDuel());
console.log(duel.progressDuel());