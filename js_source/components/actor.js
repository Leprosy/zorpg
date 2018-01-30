/**
 * actor: Component that provides actor attributes, like HPs, character stats, etc.
 */
ZORPG.Components.actor = {
    hp: 0,
    xp: 0,
    level: 1,
    name: "",
    str: 1,
    spd: 1,
    con: 1,
    ac: 0,

    // Roll attributes & get a random monster - DEBUG only?
    roll: function() {
        this.spd = ZORPG.Utils.die("1d10+4");
        this.str = ZORPG.Utils.die("1d10+4");
        this.con = ZORPG.Utils.die("1d10+4");
        this.ac = ZORPG.Utils.die("1d10+4");

        this.hp = ZORPG.Utils.die("1d30+10");
        this.xp = ZORPG.Utils.die("1d50+10");
    },

    toString: function() {
        return "<b>" + this.name + "</b>:" + this.hp + "hp " + this.spd + "spd " + this.str + "str " + this.ac + "ac";
    },

    isAlive: function() {
        return this.hp > 0;
    },

    // Damages this actor
    damage: function(ent) {
        // Calculate attack success/damage/etc.
        // attack roll - AC - Speed bonus
        // TODO: add resistances, spell buffs etc.
        var damage = ZORPG.Utils.die("1d" + ent.actor.str);
        console.log("ZORPG.Components.actor: Damage rolled = ", damage, "correction =", this.ac + ZORPG.Tables.getStatBonus(this.spd).bonus);
        damage -= this.ac + ZORPG.Tables.getStatBonus(this.spd).bonus;
        console.log("ZORPG.Components.actor: Damage corrected", damage);

        if (damage > 0) {
            this.hp -= damage;
            console.log("ZORPG.Components.actor: Actor " + this.name + " gets " + damage + " damage from " + ent.actor.name);
            ZORPG.Utils.log(this.name + " gets " + damage + " damage from " + ent.actor.name);

            // If the attack is from a monster, shake camera
            if (ent.hasCmp("monster")) {
                ZORPG.Canvas.shake(damage * 0.01)
            }
        } else {
            console.log("ZORPG.Components.actor: Actor " + this.name + " dodge attack from " + ent.actor.name);
            ZORPG.Utils.log(this.name + " dodge attack from " + ent.actor.name);
        }
    }
}
