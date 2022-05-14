function unitsToSelection(units, selectedName) {
    return units.reduce((base, unit) => {
        let selectedPhrase = (unit.name === selectedName) ? " selected" : ""; 
        return base += `<option value="${unit.name}"${selectedPhrase}>${unit.name}</option>`
    }
    ,"");
}
const defaultString = "NA";
const defaultNumber = 0;
const defaultBlue = {
    blueClass: defaultString, blueClassType: defaultString, blueSkills: defaultString,
    blueMaxhp: defaultNumber, blueStr: defaultNumber, blueMag: defaultNumber, 
    blueSkl: defaultNumber, blueSpd: defaultNumber, blueLck: defaultNumber, 
    blueDef: defaultNumber, blueRes: defaultNumber,
    blueWeaponName: defaultString, blueWeaponType: defaultString,
    blueDamageType: defaultString, blueWeaponKiller: defaultString,
    blueWeaponMt: defaultNumber, blueWeaponAcc: defaultNumber,
    blueWeaponCrt: defaultNumber
}

const defaultRed = {
    redClass: defaultString, redClassType: defaultString, redSkills: defaultString,
    redMaxhp: defaultNumber, redStr: defaultNumber, redMag: defaultNumber, 
    redSkl: defaultNumber, redSpd: defaultNumber, redLck: defaultNumber, 
    redDef: defaultNumber, redRes: defaultNumber,
    redWeaponName: defaultString, redWeaponType: defaultString,
    redDamageType: defaultString, redWeaponKiller: defaultString,
    redWeaponMt: defaultNumber, redWeaponAcc: defaultNumber,
    redWeaponCrt: defaultNumber
}

function unitToBlueObject(unit) {
    blueUnit = {
        blueClass: unit.class, blueClassType: unit.unitType.toString(), blueSkills: unit.skills.toString(),
        blueMaxhp: unit.stats.maxhp, blueStr: unit.stats.str, blueMag: unit.stats.mag, 
        blueSkl: unit.stats.skl, blueSpd: unit.stats.spd, blueLck: unit.stats.lck, 
        blueDef: unit.stats.def, blueRes: unit.stats.res,
        blueWeaponName: unit.weapon.name, blueWeaponType: unit.weapon.type,
        blueDamageType: unit.weapon.damage, blueWeaponKiller: unit.weapon.typeKiller.toString(),
        blueWeaponMt: unit.weapon.mt, blueWeaponAcc: unit.weapon.hit,
        blueWeaponCrt: unit.weapon.crt
    }
    return blueUnit;
}

function unitToRedObject(unit) {
    redUnit = {
        redClass: unit.class, redClassType: unit.unitType.toString(), redSkills: unit.skills.toString(),
        redMaxhp: unit.stats.maxhp, redStr: unit.stats.str, redMag: unit.stats.mag, 
        redSkl: unit.stats.skl, redSpd: unit.stats.spd, redLck: unit.stats.lck, 
        redDef: unit.stats.def, redRes: unit.stats.res,
        redWeaponName: unit.weapon.name, redWeaponType: unit.weapon.type,
        redDamageType: unit.weapon.damage, redWeaponKiller: unit.weapon.typeKiller.toString(),
        redWeaponMt: unit.weapon.mt, redWeaponAcc: unit.weapon.hit,
        redWeaponCrt: unit.weapon.crt
    }
    return redUnit;
}

function passQueryBlueObject(query) {
    blueUnit = {
        blueClass: query.blueClass, blueClassType: query.blueClassType, blueSkills: query.blueSkills,
        blueMaxhp: query.blueMaxhp, blueStr: query.blueStr, blueMag: query.blueMag, 
        blueSkl: query.blueSkl, blueSpd: query.blueSpd, blueLck: query.blueLck, 
        blueDef: query.blueDef, blueRes: query.blueRes,
        blueWeaponName: query.blueWeaponName, blueWeaponType: query.blueWeaponType,
        blueDamageType: query.blueDamageType, blueWeaponKiller: query.blueWeaponKiller,
        blueWeaponMt: query.blueWeaponMt, blueWeaponAcc: query.blueWeaponAcc,
        blueWeaponCrt: query.blueWeaponCrt
    }
    return blueUnit;
}

function passQueryRedObject(query) {
    redUnit = {
        redClass: query.redClass, redClassType: query.redClassType, redSkills: query.redSkills,
        redMaxhp: query.redMaxhp, redStr: query.redStr, redMag: query.redMag, 
        redSkl: query.redSkl, redSpd: query.redSpd, redLck: query.redLck,
        redDef: query.redDef, redRes: query.redRes,
        redWeaponName: query.redWeaponName, redWeaponType: query.redWeaponType,
        redDamageType: query.redDamageType, redWeaponKiller: query.redWeaponKiller,
        redWeaponMt: query.redWeaponMt, redWeaponAcc: query.redWeaponAcc,
        redWeaponCrt: query.redWeaponCrt
    }
    return redUnit;
}

module.exports = {unitsToSelection, defaultBlue, defaultRed, 
    unitToBlueObject, unitToRedObject, passQueryBlueObject, passQueryRedObject};