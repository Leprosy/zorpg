/**
 * actor: Component that provides actor attributes, like HPs, character stats, etc.
 */
ZORPG.Components.actor = {
    hp: 0,
    xp: 0,
    level: 1,
    cls: "",
    race: "",
    name: "",
    str: 1,
    end: 1,
    acc: 1,
    spd: 1,
    lck: 1,
    int: 1,
    per: 1,

    // Roll attributes & get a random monster - DEBUG only?
    roll: function() {
        this.spd = ZORPG.$.die("1d10+4");
        this.str = ZORPG.$.die("1d10+4");
        this.con = ZORPG.$.die("1d10+4");
        this.ac = ZORPG.$.die("1d10+4");

        this.hp = ZORPG.$.die("1d30+10");
        this.xp = ZORPG.$.die("1d50+10");
    },
    toString: function() {
        return "<b>" + this.name + "</b>:" + this.hp + "/" + this.getMaxHP() + "hp " + this.spd + "spd " + this.str + "str " + this.getAC() + "ac";
    },

    // Gets max HP => Level * (Endurance bonus + racial bonus + class bonus)
    getMaxHP: function() {
        var attrBonus = ZORPG.Tables.getStatBonus(this.end).value;
        var classBonus = ZORPG.Tables.cls[this.cls].hp;
        var racialBonus = ZORPG.Tables.race[this.race].hp;
        return this.level * (attrBonus + classBonus + racialBonus);
    },

    // Gets the toHit value => Acc bonus + weapon bonus + buffs
    getToHit: function() {
        var accBonus = ZORPG.Tables.getStatBonus(this.acc).value;
        var weaponBonus = 1; // This is for debug. Should be any weapon bonus

        return accBonus + weaponBonus;
    },

    // Gets actor AC => Total armor + speed attr bonus + buffs
    getAC: function() {
        var armorAC = 4; // this is a debug purpose hardcoded number. This will be the weared armor AC
        var spdBonus = ZORPG.Tables.getStatBonus(this.spd).value;
        var buffsAC = 0;

        return armorAC + spdBonus + buffsAC;
    },

    // init the char? We need this?
    init: function() {
        this.hp = this.getMaxHP();
    },

    // Is actor alive
    isAlive: function() {
        return this.hp > 0;
    },

    // Damages this actor
    damage: function(ent) {
        // Calculate attack success/damage/etc.
        // attack roll - AC - Speed bonus
        // TODO: add resistances, spell buffs etc.
        var damage = ZORPG.$.die("1d" + ent.actor.str);
        console.log("ZORPG.Components.actor: Damage rolled = ", damage, "correction =", this.ac + ZORPG.Tables.getStatBonus(this.spd).value);
        damage -= this.ac + ZORPG.Tables.getStatBonus(this.spd).value;
        console.log("ZORPG.Components.actor: Damage corrected", damage);

        if (damage > 0) {
            this.hp -= damage;
            console.log("ZORPG.Components.actor: Actor " + this.name + " gets " + damage + " damage from " + ent.actor.name);
            ZORPG.$.log(this.name + " gets " + damage + " damage from " + ent.actor.name);

            // If the attack is from a monster, shake camera
            if (ent.hasCmp("monster")) {
                ZORPG.Canvas.shake(damage * 0.01)
            }
        } else {
            console.log("ZORPG.Components.actor: Actor " + this.name + " dodge attack from " + ent.actor.name);
            ZORPG.$.log(this.name + " dodge attack from " + ent.actor.name);
        }
    }
}
