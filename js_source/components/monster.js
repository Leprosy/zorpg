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
    damage: function(ent) {
        var attacks = 1; // TODO: Calculate how many attacks per round has this char using tables
        var damage = 0;

        for (var i = 0; i < attacks; ++i) {
            var check;
            var divisor = 1; // TODO: That 1 depends on class...this should be on the tables
            var chance = ent.actor.getToHit() + ent.actor.level / divisor; // TODO: substract cursed level of ent to this
            console.log("ZORPG.Component.monster: Begining attack - divisor/chance", divisor, chance)
            do {
                check = ZORPG.$.die("1d20");
                chance += check;
            } while (check == 20);

            if (chance >= this.ac) {
                damage += ent.actor.getAttackDamage();
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