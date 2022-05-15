const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

//Set battle stats for units
//In most scenarios mt,acc,crt is static
function setupUnits(blueUnit, redUnit) {
    let status = "start";
    let battleLog = "Let the battle begin!"
    let blueBattleStats = {};
    let redBattleStats = {};

    blueBattleStats.hp = blueUnit.stats.maxhp;
    redBattleStats.hp = redUnit.stats.maxhp;

    blueBattleStats.mt = getMight(blueUnit, redUnit);
    redBattleStats.mt = getMight(redUnit, blueUnit);

    blueBattleStats.acc = getAccuracy(blueUnit, redUnit);
    redBattleStats.acc = getAccuracy(redUnit, blueUnit);

    blueBattleStats.crt = getCritRate(blueUnit)
    redBattleStats.crt = getCritRate(redUnit)
    
    return {status, battleLog, blueBattleStats, redBattleStats};
}

//Manages the simulation status and calls strike()
function progressDuel() {
    if (this.sequence === "ended") {
        return "This battle has ended";
    }

    let ret = this.strike();
    if (this.defender.hp <= 0) {
        this.sequence = "ended";
        return ret += "\n" + this.attacker.name + " has defeated " + this.defender.name;
    }

    let temp;
    switch (this.sequence) {
        case "attack":
            this.sequence = "counter attack";
            temp = this.attacker;
            this.attacker = this.defender;
            this.defender = temp;
            break;
        case "counter attack":
            this.sequence = "attack";
            temp = this.attacker;
            this.attacker = this.defender;
            this.defender = temp;
            break;
        default:
            break;
    }
    return ret;
}

//rolls for attack and crit and applies damage accordingly
//returns string describing damage dealt
function step(battleStat) {
    let log = ""
    let result;
    switch (battleStat.status) {
        case "start":
        case "Attack":
            battleStat.status = "Counter" 
            battleStat.battleLog = strike(battleStat.blueBattleStats,
                battleStat.redBattleStats, "attack"); 
            break;
        case "Counter":
            battleStat.status = "Attack" 
            battleStat.battleLog = strike(battleStat.redBattleStats,
                battleStat.blueBattleStats, "counter attack");
            break;
        case "Blue Wins!":
        case "Red Wins!":
            battleStat.battleLog = "This battle has ended";
            break;
        default:
            break;
    }

    if(battleStat.blueBattleStats.hp < 0) {
        battleStat.status = "Red Wins!";
        battleStat.battleLog += `\n${battleStat.redBattleStats.name} is victorious!`
    }

    if(battleStat.redBattleStats.hp < 0) {
        battleStat.status = "Blue Wins!";
        battleStat.battleLog += `\n${battleStat.blueBattleStats.name} is victorious!`
    }

    return battleStat; 
}

function strike(attacker, defender, phrase) {
    let log = ""

    if (doubleRoll(attacker.acc * .01)) {
        if (doubleRoll(attacker.crt * .01)) {
            defender.hp -= attacker.mt * 3;
            log = `${attacker.name} critically ${phrase}s ${defender.name} for ${attacker.mt * 3} damage!`;
        } else {
            defender.hp -= attacker.mt;
            log = `${attacker.name} ${phrase}s ${defender.name} for ${attacker.mt} damage.`;
        }
    } else {
        log = `${defender.name} dodges ${attacker.name}'s ${phrase}`;
    }

    return log;
}

    //Modern Fire Emblem games don't use true probability. Instead opting to take the average of two rolls
    //Hybrid Roll and Single Roll may be added later as options
function doubleRoll(chance) {
    let roll1 = Math.random();
    let roll2 = Math.random();
    let result = (roll1 + roll2) / 2;
    return chance >= result;
}

    //Runs might calc (base mt, magic or physical, adds effective damage)
function getMight(attacker, defender) {
    let might = 0;
    //calc base mt. Phy: str vs def, Mag: Mag vs Res
    if (attacker.weapon.damage === "physical") {
        might = attacker.stats.str + attacker.weapon.mt - defender.stats.def;
    } else if (attacker.weapon.damage === "magical") {
        might = attacker.stats.mag + attacker.weapon.mt - defender.stats.res;
    }
    //calc effective damage
    if (hasEffectiveDamage(attacker, defender)) {
        might = might * 3;
    }

    return clamp(Math.floor(might),0,999);;
}

    //Returns true if attackers weapon effectiveness intersects with a defender's unit type
function hasEffectiveDamage(attacker, defender) {
    let attackerEffectiveTypes = attacker.weapon.typeKiller;
    let defenderTypes = defender.unitType;
    let intersection = attackerEffectiveTypes.filter(value => defenderTypes.includes(value));
    return intersection.length > 0;
}



    //Calcs accuracy with weapon triangle advantage
function getAccuracy(attacker, defender) {
    let accuracy = 0;
    //calc base accuracy weapon hit + skl + lck vs spd + lck
    accuracy = attacker.weapon.hit + ((attacker.stats.skl * 3 + attacker.stats.lck) / 2) - ((defender.stats.spd * 3 + defender.stats.lck) / 2);
    //Add weapon triangle bonus
    let weaponAdvantage = weaponTriangle(attacker.weapon, defender.weapon);
    //Awakening's weapon triangle system is more complicated giving bonuses based off weapon rank.
    //Will implment later if there is time, otherwise this is ok.
    if (weaponAdvantage === "advantage")
        accuracy += 10
    else if (weaponAdvantage === "disadvantage")
        accuracy += -10;

    return clamp(Math.floor(accuracy),0,100);
}

    //Returns if attacker weapon has weapon triangle advantage or disadvantage
    //Using awakening system of sword<lance<axe<sword. Not Fates color system.
function weaponTriangle(attkWeapon, defWeapon) {
    let attType = attkWeapon.type;
    let defType = defWeapon.type;
    let weaponAdvantage = "none"

    if (attType === "sword" && defType === "axe")
        weaponAdvantage = "advantage";
    else if (attType === "axe" && defType === "lance")
        weaponAdvantage = "advantage";
    else if (attType === "lance" && defType === "sword")
        weaponAdvantage = "advantage";
    else if (attType === "sword" && defType === "lance")
        weaponAdvantage = "disadvantage";
    else if (attType === "lance" && defType === "axe")
        weaponAdvantage = "disadvantage";
    else if (attType === "axe" && defType === "sword")
        weaponAdvantage = "disadvantage";

    return weaponAdvantage;
}

function getCritRate(attacker) {
    let critRate = attacker.weapon.crt + (attacker.stats.skl / 2)
    return clamp(Math.floor(critRate),0,100);
}

module.exports = {setupUnits, step};