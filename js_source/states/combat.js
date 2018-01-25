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




    getAliveChars: function() {
        var list = [];
        var chars = ZORPG.Player.party.actors;

        for (var i = 0; i < chars.length; ++i) {
            if (chars[i].actor.isAlive()) {
                list.push(chars[i]);
            }
        }

        return list;
    },

    beginTurn: function() {
        console.log("ZORPG.State.combat: Turn begins.");
        this.combatQ = [];
        this.combatIndex = 0;

        // Move monsters

        // Check if are fightable monsters & build combat queue
        this.combatQ = ZORPG.Monsters.getFightReady();

        if (this.combatQ.length > 0) {
            this.combatQ = this.combatQ.concat(this.getAliveChars());

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

            if (!ZORPG.Player.party.isAlive()) {
                alert("GAME OVER!"); // TODO: please...
            }
        } else if (fighter.actor.isAlive()) { // fighter is a Party character...attack targeted Monster
            var monster = this.getTargetedMonster();
            monster.actor.damage(fighter);

            if (!monster.actor.isAlive()) { // Killed monster -> removed
                console.log("ZORPG.State.combat: Monster killed", monster)
                ZORPG.Utils.remove(this.combatQ, monster);
            }
        }

        this.combatIndex++;
    },

    // Gets the monster entity that is being targeted by player
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




    // Main update
    update: function() {
        console.log("ZORPG.State.combat: Update begins.")
        var _this = this;

        // Checking if turn is begining
        if (this.combatQ.length === this.combatIndex) {
            this.beginTurn();
        }

        // Are there monsters left? If not...return to play state
        if (this.combatQ.length > ZORPG.Player.party.actors.length) {
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
