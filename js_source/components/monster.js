/**
 * monster: Component that provides monster attributes, like type, num of attacks, treasure spawned, etc.
 */

ZORPG.Components.monster = {
    name: "",
    xp: 0,
    hp: 0,
    dex: 0,

    attacks: 1,
    attackDie: "1d12",
    attackType: "dex",

    rangeAttack: false,

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
        return "<b>" + this.name + "</b>:" + this.hp + "hp " + this.dex + "dex " + this.attackDie + "die";
    },

    // Is the monster alive?
    isAlive: function() {
        return this.hp > 0;
    },

    // Entity actor attacks this monster
    getAttacked: function(ent) {
        var die = ZORPG.$.die("1d10");
        console.log("ZORPG.Component.monster: Check throw 'dex' own/die:", this.dex, die);

        if (die > this.dex) {
            console.log("ZORPG.Component.monster: Monster receives attack", this.toString())
        } else {
            console.log("ZORPG.Component.monster: Monster dodges", this.toString())
        }
    }
}