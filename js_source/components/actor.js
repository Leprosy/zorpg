/**
 * actor: Component that provides actor attributes, like HPs, character stats, etc.
 */
ZORPG.Components.actor = {
    hp: 0,
    xp: 0,
    level: 1,
    name: "",
    speed: 0,
    str: 1,
    spd: 1,
    con: 1,
    ac: 0,

    toString: function() {
        return this.name + ":" + this.hp + "hp";
    }
}