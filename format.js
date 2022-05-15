function unitsToSelection(units, selectedName) {
    return units.reduce((base, unit) => {
        let selectedPhrase = (unit.name === selectedName) ? " selected" : ""; 
        return base += `<option value="${unit.name}"${selectedPhrase}>${unit.name}</option>`
    }
    ,"");
}

function passUserInfo(user) {
    if (user === undefined) {
        return {loggedIn: false};
    } else {
        return {loggedIn: true, userName: user.displayName};
    }
}

const defaultString = "NA";
const defaultNumber = 0;
const emptyArray = [];
const defaultUnit = {
    name: defaultString, class: defaultString, 
    unitType: emptyArray, skills: emptyArray,
    stats: {maxhp: defaultNumber, 
        str: defaultNumber, mag: defaultNumber, 
        skl: defaultNumber, spd: defaultNumber, lck: defaultNumber, 
        def: defaultNumber, res: defaultNumber},
    weapon: {name: defaultString, 
    type: defaultString, damage: defaultString,
    mt: defaultNumber, hit: defaultNumber, crt: defaultNumber,
    typeKiller: emptyArray}
}

const defaultBattle = {
    status: "unstarted",
    blueBattleStats: {
    },
    redBattleStats: {
    },
    battleLog: ""
}

function passQueryBlueObject(query) {
    blueUnit = {
        name: query.blueName, class: query.blueClass, 
        unitType: query.blueClassType.split(",").filter(i => i), skills: query.blueSkills.split(",").filter(i => i),
        stats: {maxhp: Number(query.blueMaxhp), 
            str: Number(query.blueStr), mag: Number(query.blueMag), 
            skl: Number(query.blueSkl), spd: Number(query.blueSpd), lck: Number(query.blueLck), 
            def: Number(query.blueDef), res: Number(query.blueRes)},
        weapon: {name: query.blueWeaponName, 
        type: query.blueWeaponType, damage: query.blueDamageType,
        mt: Number(query.blueWeaponMt), hit: Number(query.blueWeaponAcc), crt: Number(query.blueWeaponCrt),
        typeKiller: query.blueWeaponKiller.split(",").filter(i => i)}
    }
    return blueUnit;
}

function passQueryRedObject(query) {
    redUnit = {
        name: query.redName, class: query.redClass, 
        unitType: query.redClassType.split(",").filter(i => i), skills: query.redSkills.split(",").filter(i => i),
        stats: {maxhp: Number(query.redMaxhp), 
            str: Number(query.redStr), mag: Number(query.redMag), 
            skl: Number(query.redSkl), spd: Number(query.redSpd), lck: Number(query.redLck), 
            def: Number(query.redDef), res: Number(query.redRes)},
        weapon: {name: query.redWeaponName, 
        type: query.redWeaponType, damage: query.redDamageType,
        mt: Number(query.redWeaponMt), hit: Number(query.redWeaponAcc), crt: Number(query.redWeaponCrt),
        typeKiller: query.redWeaponKiller.split(",").filter(i => i)}
    }
    return redUnit;
}

function passQueryBattleStatus(query) {
    let status =  query.status
    let battleLog = "";
    let blueBattleStats =  {
        hp: query.bluehp,
        mt: query.blueMt,
        acc: query.blueHit,
        crt: query.blueCrt,
    }
    let redBattleStats = {
        hp: query.redhp,
        mt: query.redMt,
        acc: query.redHit,
        crt: query.redCrt,
    }
    return {status, battleLog, blueBattleStats, redBattleStats}
}

module.exports = {unitsToSelection, passUserInfo, defaultUnit, defaultBattle, 
    passQueryBlueObject, passQueryRedObject, passQueryBattleStatus};