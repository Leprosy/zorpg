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

        // Get how many monsters are in the monster pos
        setGroups: function() {
            // Clear
            for (var i = 0; i < monsters.length; ++i) { monsters[i].pos.group = ""}

            for (var i = 0; i < monsters.length; ++i) {
                var monster = monsters[i];
                var list = [monster];

                if (monster.pos.group === "" && monster.monster.isAlive()) {
                    for (var j = 0; j < monsters.length; ++j) {
                        if (j!== i) {
                            if (monster.pos.x === monsters[j].pos.x && monster.pos.y === monsters[j].pos.y && monsters[j].monster.isAlive()) {
                                list.push(monsters[j]);
                            }
                        }
                    }

                    if (list.length > 1) {
                        for (var k = 0; k < list.length; ++k) {
                            list[k].pos.group = k + "-" + (list.length - 1);
                        }

                        console.log("MONSTER", monster, "list", list);
                    }
                }
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
    dex: 5,
    attacks: 1,
    attackDie: "1d12",
    attackType: "dex",
    rangeAttack: false,
    gold: 5,
    gems: 5
},{
    name: "Orc",
    xp: 200,
    hp: 25,
    dex: 6,
    attacks: 2,
    attackDie: "1d10",
    attackType: "dex",
    rangeAttack: true,
    gold: 10,
    gems: 0
},{
    name: "Slime",
    xp: 50,
    hp: 2,
    dex: 8,
    attacks: 1,
    attackDie: "1d2",
    attackType: "dex",
    rangeAttack: false,
    gold: 0,
    gems: 0
},]
