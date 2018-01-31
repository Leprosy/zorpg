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

    // Debug component
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

    // Gets an attack damage with bonuses and all - "Bonuses" can't reduce this bellow 1
    getAttackDamage: function() {
        var weaponDamage = ZORPG.$.die("1d6") // TODO: this die is debug only...items should provide this
        var bonusDamage = ZORPG.Tables.getStatBonus(this.str).value;
        var buffsDamage = 0;

        return Math.max(weaponDamage + bonusDamage + buffsDamage, 1);
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
        // TODO: add resistances, spell buffs etc.
        var damage = ZORPG.$.die(ent.monster.attackDie);
        var totalDamage = 0;

        // If damage is physical -> AC
        if (ent.monster.attackType === "physical") {
            var check = ZORPG.$.die("1d20"); // Check die: 1 = Critical save, 20 = Critical fail(chance of double damage)
            console.log("ZORPG.Component.actor: Check die/Damage", check, damage);

            if (check > 1) {
                if (check == 20) {
                    totalDamage += damage;
                }

                check += ent.monster.toHit / 4 + ZORPG.$.die("1d" + ent.monster.toHit);
                var ac = this.getAC(); // TODO: Check if any chars have blocked
                console.log("ZORPG.Component.actor: Corrected check die/Armor Class", check, ac);

                if (ac <= check) {
                    totalDamage += damage;
                }
            }
        } else {
            // If damage is magical -> saving throw
            // NOT IMPLEMENTED YET!
            alert("MAGIC! OAW!")
        }

        if (totalDamage > 0) {
            this.hp -= totalDamage;
            console.log("ZORPG.Components.actor: Actor " + this.name + " gets " + totalDamage + " damage from " + ent.monster.name);
            ZORPG.$.log(this.name + " gets " + totalDamage + " damage from " + ent.monster.name);
            ZORPG.Canvas.shake(totalDamage * 0.01);
        } else {
            console.log("ZORPG.Components.actor: Actor " + this.name + " dodge attack from " + ent.monster.name);
            ZORPG.$.log(this.name + " dodge attack from " + ent.monster.name);
        }
    }
}
