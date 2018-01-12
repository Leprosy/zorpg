// Play loop state
ZORPG.State.add("combat", {
    name: "Combating",
    turnPass: false,
    combatQ: [],

    init: function() {
        // Set key handlers
        var _this = this;
        ZORPG.Key.setPre(function(ev) {
            return (!ZORPG.Canvas.isUpdating);
        });
        ZORPG.Key.setPost(function(ev) {
            if (ev.code!== "Escape" && ev.code.indexOf("Arrow") < 0) {
                _this.update();
            }
        });

        ZORPG.Key.add("Escape", function(ev) {
            ZORPG.Canvas.clear();
            ZORPG.State.set("main_menu");
        });
        ZORPG.Key.add("KeyA", function(ev) {
            ZORPG.Player.pos.rotL()
        });
        ZORPG.Key.add("KeyD", function(ev) {
            ZORPG.Player.pos.rotR()
        });
        ZORPG.Key.add("Space", function(ev) {
            console.log("ATTACK!");
            //_this.turnPass = true;
        });

        // Init monster queue & draw
        _this.turnPass = true;
        this.update();
    },

    update: function() {
        console.log("ZORPG.State.combat: Updating")
        var _this = this;

        // Begin turn
        if (this.turnPass) {
            this.turnPass = false;
            console.log("ZORPG.State.combat: Turn begins.");

            // Move monsters
            /* for (var i = 0; i < 3; ++i) {
                var combat = ZORPG.Monsters[i].pos.seek(ZORPG.Player.pos);

                if (combat) {
                    ZORPG.State.set("combat", {monster: ZORPG.Monsters[i]});
                }
            } */

            // Build combat queue
            for (var i = 0; i < ZORPG.Monsters.length; ++i) {
                var monster = ZORPG.Monsters[i];

                if (monster.pos.equals(ZORPG.Player.pos) && !ZORPG.Utils.inArray(monster, this.combatQ)) {
                    this.combatQ.push(monster); // Check if monster is alive
                }
            }
            for (var i = 0; i < ZORPG.Player.party.actors.length; ++i) {
                this.combatQ.push(ZORPG.Player.party.actors[i]); // Check if actor is alive
            }

            this.combatQ.sort(function(a, b) {
                if (a.actor.spd < b.actor.spd) {
                    return 1;
                }
                if (a.actor.spd > b.actor.spd) {
                    return -1;
                }
                return 0;
            })
        }

        // Render
        ZORPG.Canvas.update(function() {
            console.log("ZORPG.State.combat: Update completed");
            $("#console").html("Combating:\n: " + JSON.stringify(_this.combatQ));
        });
    },

    destroy: function() {
        ZORPG.Key.removeAll();
    }
});
