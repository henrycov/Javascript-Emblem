class DuelSim {
    //Basic Constructor
    constructor(unit1, unit2) {
        this.unit1 = unit1;
        this.unit2 = unit2;
        this.setupUnits();

        this.round = 0;
        this.sequence = "attack"
        
        this.attacker = this.unit1;
        this.defender = this.unit2;
    }

    //Set battle stats for units
    //In most scenarios mt,acc,crt is static
    setupUnits() {
        this.unit1.hp = this.unit1.stats.maxhp;
        this.unit2.hp = this.unit2.stats.maxhp;

        this.unit1.mt = this.constructor.getMight(this.unit1, this.unit2);
        this.unit2.mt = this.constructor.getMight(this.unit2, this.unit1);
        
        this.unit1.acc = this.constructor.getAccuracy(this.unit1, this.unit2);
        this.unit2.acc = this.constructor.getAccuracy(this.unit2, this.unit1);

        this.unit1.crt = this.unit1.weapon.crt + (this.unit1.stats.skl/2)
        this.unit2.crt = this.unit2.weapon.crt + (this.unit2.stats.skl/2) 
    }
    
    //Manages the simulation status and calls strike()
    progressDuel() {
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
    strike() {
        if (this.constructor.doubleRoll(this.attacker.acc * .01)) {
            if(this.constructor.doubleRoll(this.attacker.crt * .01)) {
                this.defender.hp -= this.attacker.mt * 3;
                return this.attacker.name + " lands a CRITICAL " + this.sequence + " on " + this.defender.name + " for " + this.attacker.mt * 3 + " damage."
            } else {
            this.defender.hp -= this.attacker.mt;
            return this.attacker.name + " " + this.sequence + "s " + this.defender.name + " for " + this.attacker.mt + " damage."
            }
        } else {
            return this.attacker.name + " misses their " + this.sequence;
        }
    }

    //Modern Fire Emblem games don't use true probability. Instead opting to take the average of two rolls
    //Hybrid Roll and Single Roll may be added later as options
    static doubleRoll(chance) {
        let roll1 = Math.random();
        let roll2 = Math.random();
        let result = (roll1 + roll2)/2;
        return chance >= result;
    }

    //Runs might calc (base mt, magic or physical, adds effective damage)
    static getMight(attacker, defender) {
        let might = 0;
        //calc base mt. Phy: str vs def, Mag: Mag vs Res
        if (attacker.weapon.damage === "physical") {
            might = attacker.stats.str + attacker.weapon.mt - defender.stats.def;
        } else if (attacker.weapon.damage === "magical") {
            might = attacker.stats.mag + attacker.weapon.mt - defender.stats.res;
        }
        //calc effective damage
        if (this.hasEffectiveDamage(attacker, defender)) {
            might = attacker.mt * 3;
        }

        return might;
    }

    //Returns true if attackers weapon effectiveness intersects with a defender's unit type
    static hasEffectiveDamage(attacker, defender) {
        let attackerEffectiveTypes = attacker.weapon.typeKiller;
        let defenderTypes = defender.unitType; 
        let intersection = attackerEffectiveTypes.filter(value => defenderTypes.includes(value));
        return intersection.length > 0;
    }

    //Calcs accuracy with weapon triangle advantage
    static getAccuracy(attacker, defender) {
        let accuracy = 0;
        //calc base accuracy weapon hit + skl + lck vs spd + lck
        accuracy = attacker.weapon.hit + ((attacker.stats.skl * 3 + attacker.stats.lck)/2) - ((defender.stats.spd * 3 + defender.stats.lck)/2);
        //Add weapon triangle bonus
        let weaponTriangle = this.weaponTriangle(attacker.weapon, defender.weapon);
        //Awakening's weapon triangle system is more complicated giving bonuses based off weapon rank.
        //Will implment later if there is time, otherwise this is ok.
        if(weaponTriangle === "advantage")
            accuracy += 10
        else if (weaponTriangle === "disadvantage")
            accuracy += -10;

        return accuracy;
    }

    //Returns if attacker weapon has weapon triangle advantage or disadvantage
    //Using awakening system of sword<lance<axe<sword. Not Fates color system.
    static weaponTriangle(attkWeapon, defWeapon) {
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
}


module.exports = {DuelSim};