var ZORPG = ZORPG || {};

// Monsters!
ZORPG.Monsters = (function() {
    var monsters = [];

    return {
        init: function(totalMonsters) {
            var total = totalMonsters || 10

            for (var i = 0; i < total; ++i) {
                var ent = new ZORPG.Ent("monster" + i, ["pos", "monster"]);
                ent.pos.x = ZORPG.$.die("1d20")
                ent.pos.y = ZORPG.$.die("1d20");
                ZORPG.$.extend(ent.monster, ZORPG.Monsters.data[ZORPG.$.die("1d3") - 1]);
                ent.monster.name = ent.monster.name + " " + i;
                monsters.push(ent);
            }
        },

        // Iterate calls in the monster list
        // TODO: Check if monster is alive?
        each: function(call) {
            for (var i = 0; i < monsters.length; ++i) {
                call(monsters[i], i);
            }
        },

        // Remove a monster
        remove: function(ent) {
            var index = monsters.indexOf(ent);

            if (index >= 0) {
                monsters.splice(index, 1);
            }
        },

        // Get the fight-ready monsters(alive & in the same position as the party)
        getFightReady: function() {
            var list = [];

            for (var i = 0; i < monsters.length; ++i) {
                if (monsters[i].pos.equals(ZORPG.Player.pos) && monsters[i].monster.isAlive()) {
                    list.push(monsters[i]);
                }
            }

            return list;
        },
        willFight: function() {
            return this.getFightReady().length > 0;
        },

        // Roam the map, seeking and trying to kill the party
        // Returns true if there is a fight
        // TODO: refactor checking moster alive
        seekAndDestroy: function() {
            this.each(function(monster) {
                if (monster.monster.isAlive()) {
                    if (monster.pos.seek(ZORPG.Player.pos)) {
                        weHaveFight = true;
                    }
                }
            });
        }
    }
})();

/**
 * Monsters definition?
 */
ZORPG.Monsters.data = [{
    name: "Goblin",
    xp: 150,
    hp: 20,
    ac: 6,
    spd: 15,
    attacks: 1,
    attackDie: "1d12",
    attackType: "physical",
    toHit: 2,
    rangeAttack: false,
    gold: 5,
    gems: 5
},{
    name: "Orc",
    xp: 200,
    hp: 25,
    ac: 5,
    spd: 17,
    attacks: 1,
    attackDie: "1d10",
    attackType: "physical",
    toHit: 5,
    rangeAttack: true,
    gold: 10,
    gems: 0
},{
    name: "Slime",
    xp: 50,
    hp: 2,
    ac: 0,
    spd: 25,
    attacks: 2,
    attackDie: "1d2",
    attackType: "physical",
    toHit: 0,
    rangeAttack: false,
    gold: 0,
    gems: 0
},]
