function unitsToSelection(units, selectedName) {
    return units.reduce((base, unit) => {
        let selectedPhrase = (unit.name === selectedName) ? " selected" : ""; 
        return base += `<option value="${unit.name}"${selectedPhrase}>${unit.name}</option>`
    }
    ,"");
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

function passQueryBlueObject(query) {
    blueUnit = {
        name: query.blueName, class: query.blueClass, 
        unitType: query.blueClassType, skills: query.blueSkills,
        stats: {maxhp: query.blueMaxhp, 
            str: query.blueStr, mag: query.blueMag, 
            skl: query.blueSkl, spd: query.blueSpd, lck: query.blueLck, 
            def: query.blueDef, res: query.blueRes},
        weapon: {name: query.blueWeaponName, 
        type: query.blueWeaponType, damage: query.blueDamageType,
        mt: query.blueWeaponMt, hit: query.blueWeaponAcc, crt: query.blueWeaponCrt,
        typeKiller: query.blueWeaponKiller}
    }
    return blueUnit;
}

function passQueryRedObject(query) {
    redUnit = {
        name: query.redName, class: query.redClass, 
        unitType: query.redClassType, skills: query.redSkills,
        stats: {maxhp: query.redMaxhp, 
            str: query.redStr, mag: query.redMag, 
            skl: query.redSkl, spd: query.redSpd, lck: query.redLck, 
            def: query.redDef, res: query.redRes},
        weapon: {name: query.redWeaponName, 
        type: query.redWeaponType, damage: query.redDamageType,
        mt: query.redWeaponMt, hit: query.redWeaponAcc, crt: query.redWeaponCrt,
        typeKiller: query.redWeaponKiller}
    }
    return redUnit;
}

module.exports = {unitsToSelection, defaultUnit, passQueryBlueObject, passQueryRedObject};