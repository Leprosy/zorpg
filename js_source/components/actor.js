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

    items: [],

    // Debug component
    toString: function() {
        return "<b>" + this.name + "</b>:" + this.hp + "/" + this.getMaxHP() +
               "hp " + this.spd + "spd " + this.str + "str " + this.getAC() + "ac";
    },

    // Gets max HP => Level * (Endurance bonus + racial bonus + class bonus)
    getMaxHP: function() {
        var attrBonus = ZORPG.Tables.getStatBonus(this.end).value;
        var classBonus = ZORPG.Tables.cls[this.cls].hp;
        var racialBonus = ZORPG.Tables.race[this.race].hp;
        return this.level * (attrBonus + classBonus + racialBonus); // + Bodybuilding
    },

    // Gets the toHit value => Acc bonus + weapon bonus + buffs. TODO: substract curses, add buffs
    getToHit: function() {
        var accBonus = ZORPG.Tables.getStatBonus(this.acc).value;
        var weaponBonus = 0;

        for (var i = 0; i < this.items.length; ++i) {
            var item = this.items[i].item;

            if (item.type === "weapon" && item.equiped) {
                weaponBonus += item.getToHit();
            }
        }

        console.log("ZORPG.Component.actor: toHit from", this.name, "toHit/bonus", weaponBonus, accBonus);
        return accBonus + weaponBonus;
    },

    // Gets actor AC => Total armor + speed attr bonus + buffs
    getAC: function() {
        var spdBonus = ZORPG.Tables.getStatBonus(this.spd).value;
        var buffsAC = 0;
        var armorAC = 0;

        for (var i = 0; i < this.items.length; ++i) {
            var item = this.items[i].item;

            if (item.equiped) {
                armorAC += item.getAC();
            }
        }
        console.log("ZORPG.Component.actor: AC from", this.name, "AC/bonus/buff", armorAC, spdBonus, buffsAC);
        return armorAC + spdBonus + buffsAC;
    },

    // Gets an attack damage with bonuses and all - "Bonuses" can't reduce this bellow 1
    getAttackDmg: function() {
        var strBonus = ZORPG.Tables.getStatBonus(this.str).value;
        var buffsDmg = 0;
        var weaponDmg = 0;

        for (var i = 0; i < this.items.length; ++i) {
            var item = this.items[i].item;

            if (item.type === "weapon" && item.equiped) {
                weaponDmg = ZORPG.$.die(item.getDmg());
            }
        }

        console.log("ZORPG.Component.actor: Damage from", this.name, "die/dmg/bonus/buff", item.getDmg(), weaponDmg, strBonus, buffsDmg);
        return Math.max(weaponDmg + strBonus + buffsDmg, 1);
    },

    // TODO: init the char? We need this? useful for debug
    init: function() {
        // Generate hit points
        this.hp = this.getMaxHP();

        // Generate random items
        var armor = new ZORPG.Ent("", ["item"]); armor.item.generate("armor"); armor.item.equiped = true;
        var shield = new ZORPG.Ent("", ["item"]); shield.item.generate("shield"); shield.item.equiped = true;
        var weapon = new ZORPG.Ent("", ["item"]); weapon.item.generate("weapon"); weapon.item.equiped = true;
        this.items.push(armor, shield, weapon);
    },

    // Is actor alive
    isAlive: function() {
        return this.hp > 0;
    },

    // this actor gets attacked
    getAttacked: function(ent) {
        // Calculate attack success/damage/etc.
        // TODO: add resistances, spell buffs etc.

        // If damage is physical -> AC
        var totalDamage = 0;

        if (ent.monster.attackType === "physical") {
            var v = ZORPG.$.die("1d20");

            if (v == 1) { // Critical save
                // Blocked
            } else {
                if (v == 20) { // Critical fail
                    totalDamage += this.getActorDamage(ent);
                }

                v += ent.monster.toHit / 4 + ZORPG.$.die("1d" + ent.monster.toHit);
                var ac = this.getAC() + 10; //(!_charsBlocked[charNum] ? 10 : c.getCurrentLevel() / 2 + 15);

                if (ac > v) {
                    // Blocked
                } else {
                    totalDamage += this.getActorDamage(ent);
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
    },

    getActorDamage: function(ent) {
        var damage = ZORPG.$.die(ent.monster.attackDie);

        /*if (charSavingThrow(monsterData._attackType))
            damage /= 2;*/

        // Some code related magic types of damage

        /*while (damage > 0 && c.charSavingThrow(monsterData._attackType))
            damage /= 2;*/

        //damage -= party._powerShield;
        return damage;
    }
}
