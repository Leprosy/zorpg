// Play loop state
ZORPG.State.add("combat", {
    name: "Combating",
    combatQ: [],
    combatIndex: 0,
    combatTarget: 0,

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
        });

        // Init combat
        this.update();
    },




    beginTurn: function() {
        console.log("ZORPG.State.combat: Turn begins.");
        var _this = this;
        this.combatQ = [];
        this.combatIndex = 0;

        // Move monsters

        // Check if are fightable monsters
        _this.combatQ = ZORPG.Monsters.getFightReady();

        if (this.combatQ.length > 0) {
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
        }
    },

    action: function() {
        var fighter = this.combatQ[this.combatIndex];
        console.log("ZORPG.State.combat: Action from", fighter);

        // fighter is a Monster...attack party
        if (fighter.hasCmp("monster")) {
            ZORPG.Player.party.damage(fighter);
        } else { // fighter is a Party character...attack targeted Monster
            this.getTargetedMonster().actor.damage(fighter);
        }

        this.combatIndex++;
    },

    getTargetedMonster: function() {
        var j = 0;

        for (var i = 0; i < this.combatQ.length; ++i) {
            if (this.combatQ[i].hasCmp("monster")) {
                if (j === this.combatTarget) {
                    return this.combatQ[i];
                } else {
                    j++;
                }
            }
        }
    },

    update: function() {
        console.log("ZORPG.State.combat: Update begins.")
        var _this = this;

        // Checking if turn is begining
        if (this.combatQ.length === this.combatIndex) {
            this.beginTurn();
        }

        // Are there monsters left? If not...return to play state
        if (this.combatQ.length > 0) {
            // Perform actions until human
            while (this.combatQ.length > this.combatIndex && this.combatQ[this.combatIndex].hasCmp("monster")) {
                this.action();
            }

            // Ready for the first human
            this.render();
        } else {
            ZORPG.State.set("play");
        }
    },

    // Update graphics
    render: function() {
        ZORPG.Canvas.setHUD("combat", { monsters: this.combatQ });
        ZORPG.Canvas.update(function() { console.log("ZORPG.State.combat: Update completed") });
    },

    destroy: function() {
        ZORPG.Key.removeAll();
    }
});
