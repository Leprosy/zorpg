var ZORPG = ZORPG || {};

// Monsters!
ZORPG.Monsters = (function() {
    var monsters = [];

    return {
        init: function(totalMonsters) {
            var total = totalMonsters || 10

            for (var i = 0; i < total; ++i) {
                var ent = new ZORPG.Ent("monster" + i, ["pos", "actor", "monster"]);
                ent.pos.x = ZORPG.Utils.die("1d15")
                ent.pos.y = ZORPG.Utils.die("1d15");
                ent.actor.name = "Monster " + i;
                ent.actor.roll();
                ent.actor.spd += 5;
                ent.monster.gold = 50;
                ent.monster.xp = 30;
                monsters.push(ent);
            }
        },

        // Iterate calls in the monster list
        // TODO: Check if monster is alive?
        each: function(call) {
            //console.log("ZORPG.Monster: Iterating call", call);

            for (var i = 0; i < monsters.length; ++i) {
                //console.log("ZORPG.Monster: Member", i, monsters[i]);
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
                if (monsters[i].pos.equals(ZORPG.Player.pos) && monsters[i].actor.isAlive()) {
                    list.push(monsters[i]);
                }
            }

            console.log("MONSTERS:", list)
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
                if (monster.actor.isAlive()) {
                    if (monster.pos.seek(ZORPG.Player.pos)) {
                        weHaveFight = true;
                    }
                }
            });
        }
    }
})();
