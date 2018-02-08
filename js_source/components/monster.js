/**
 * monster: Component that provides monster attributes, like type, num of attacks, treasure spawned, etc.
 */

ZORPG.Components.monster = {
    name: "",
    xp: 0,
    hp: 0,
    ac: 0,
    spd: 0,
    attacks: 1,
    //hatesClass -> not implemented
    attackDie: "1d12",
    // This replaces this?
    //strikes 1   The 'X' in the XdY equation
    //dmgPerStrike    12  The 'Y' in the XdY equation
    attackType: "physical",
    //specialAttack   None    Special effects caused by attack
    toHit: 2,
    rangeAttack: false,
    /*monsterType Unique  Certain monster types are affected differently by some spells
    res_fire    0   Resistance to fire based attacks
    res_elec    0   Resistance to electricity based attacks
    res_cold    0   Resistance to cold based attacks
    res_poison  0   Resistance to poison based attacks
    res_energy  0   Resistance to energy based attacks
    res_magic   0   Resistance to magic based attacks
    res_physical    0   Resistance to physical attacks
    field_29    0   unknown! Doesn't seem to be used anywhere*/
    gold: 0,
    gems: 0,
    //itemDrop    1   probability that monster drops an item
    //flying  False   Boolean value: monster flies or it doesn't
    //imageNumber 5   Sprite ID (xxx.MON and xxx.ATK files)
    //loopAnimation   False   Frames either increment and loop, or bounce start to end and back
    //animationEffect 0   Special effects
    //idleSound   105 Effect number played by PlayFX every 5 seconds
    //attackVoc   unnh    xxx.VOC file played when monster attacks

    // Debug
    toString: function() {
        return "<b>" + this.name + "</b>:" + this.hp + "hp " + this.spd + "spd " + this.attackDie + "die " + this.ac + "ac";
    },

    // Is the monster alive?
    isAlive: function() {
        return this.hp > 0;
    },

    // Entity actor attacks this monster
    getAttacked: function(ent) {
        var attacks = 1; // TODO: calculate attacks per round using table
        var damage = 0;
        var chance = 0;

        for (var i = 0; i < attacks; ++i) {
            chance = ent.actor.getToHit();
            chance += ent.actor.level / 1 // TODO: That divisor is tabled: Kn/Ba: 1, Pa/Ar/Ro/Ni/Ra: 2, Cl/Dr: 3, So: 4
            var v = 0;

            do {
                v = ZORPG.$.die("1d20");
                chance += v;
            } while (v == 20);

            console.log("ZORPG.Components.monster: Chance roll/monster ac for ", this.name, chance, this.ac + 10);
            if (chance >= (this.ac + 10)) {
                damage += ent.actor.getAttackDmg();
            }
        }

        console.log("ZORPG.Component.monster: Total attack damage", damage);

        if (damage > 0) {
            console.log("ZORPG.Component.monster: " + this.name + " receives " + damage + " from " + ent.actor.name);
            ZORPG.$.log(this.name + " receives " + damage + " from " + ent.actor.name);
            this.hp -= damage;
        } else {
            console.log("ZORPG.Component.monster: " + this.name + " dodges attack from " + ent.actor.name);
            ZORPG.$.log(this.name + " dodges attack from " + ent.actor.name);
        }
    }
}