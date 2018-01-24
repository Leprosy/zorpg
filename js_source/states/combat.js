// Play loop state
ZORPG.State.add("combat", {
    name: "Combating",
    combatQ: [],
    combatIndex: 0,
    target: 0,

    init: function() {
        // Set key handlers
        var _this = this;
        ZORPG.Key.setPre(function(ev) {
            return (!ZORPG.Canvas.isUpdating);
        });

        ZORPG.Key.add("Escape", function(ev) {
            ZORPG.Canvas.clear();
            ZORPG.State.set("main_menu");
        });
        ZORPG.Key.add("KeyA", function(ev) {
            ZORPG.Player.pos.rotL();
            _this.render();
        });
        ZORPG.Key.add("KeyD", function(ev) {
            ZORPG.Player.pos.rotR()
            _this.render();
        });
        ZORPG.Key.add("Space", function(ev) {
            _this.action();
            _this.update();
            _this.render();
        });

        // Init monster queue & draw
        this.update();
    },

    beginTurn: function() {
        console.log("ZORPG.State.combat: Turn begins.");
        this.combatQ = [];
        this.combatIndex = 0;

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

            if (monster.pos.equals(ZORPG.Player.pos) && !ZORPG.Utils.inArray(monster, this.combatQ) && monster.actor.hp >= 0) {
                this.combatQ.push(monster);
            }
        }

        // If no monsters...return to play
        if (this.combatQ.length === 0) {
            ZORPG.State.set("play");
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
        });

        console.log("ZORPG.State.combat: Combat queue generated", this.combatQ);
    },

    action: function() {
        var fighter = this.combatQ[this.combatIndex];
        console.log("ZORPG.State.combat: Action from", fighter);

        // TODO: ENCAPSULATE THIS IN COMPONENTS
        // fighter is a Monster...attack party
        if (fighter.hasCmp("monster")) {
            ZORPG.Player.party.damage(fighter);
        } else { // fighter is a Party character...attack targeted Monster
            var monster = this.getTargetedMonster();
            monster.actor.damage(fighter);
        }

        this.combatIndex++;
    },

    getTargetedMonster: function() {
        var j = 0;

        for (var i = 0; i < this.combatQ.length; ++i) {
            if (this.combatQ[i].hasCmp("monster")) {
                if (j === this.target) {
                    return this.combatQ[i];
                } else {
                    j++;
                }
            }
        }
    },

    update: function() {
        console.log("ZORPG.State.combat: Updating")
        var _this = this;

        // Begin turn
        if (this.combatQ.length === this.combatIndex) {
            this.beginTurn();
        }

        // Perform actions until human
        while (this.combatQ.length > this.combatIndex && this.combatQ[this.combatIndex].hasCmp("monster")) {
            this.action();
        }
    },

    render: function() {
        var _this = this;

        ZORPG.Canvas.update(function() {
            console.log("ZORPG.State.combat: Update completed");

            // Update HUD
            ZORPG.Canvas.setHUD("combat", {monsters: _this.combatQ});
            //$("#console").html("Combating:\n: " + JSON.stringify(ZORPG.Monsters) + "\n" + JSON.stringify(ZORPG.Player.party.actors));
        });
    },

    destroy: function() {
        ZORPG.Key.removeAll();
    }
});
