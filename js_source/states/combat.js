// Play loop state
ZORPG.State.add("combat", {
    name: "Combating",
    combatQ: [],
    combatIndex: 0,
    combatTarget: 0,
    combatLoot: {xp:0,gold:0,gems:0},

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
            _this.action("pass");
            _this.update();
        });
        ZORPG.Key.add("KeyF", function(ev) {
            _this.action("attack");
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
        ZORPG.Monsters.seekAndDestroy();

        // Check if are fightable monsters & build combat queue
        if (ZORPG.Monsters.willFight()) {
            this.combatQ = ZORPG.Monsters.getFightReady().concat(this.getAliveChars()).sort(function(a, b) {
                var spdA = a.hasCmp("actor") ? a.actor.dex : a.monster.dex;
                var spdB = b.hasCmp("actor") ? b.actor.dex : b.monster.dex;
                if (spdA < spdB) return 1;
                if (spdA > spdB) return -1;
                return 0;
            });

            console.log("ZORPG.State.combat: Combat queue generated", this.combatQ);
        }
    },

    action: function(action) {
        var fighter = this.combatQ[this.combatIndex];
        console.log("ZORPG.State.combat: Action from", fighter);

        // fighter is a Monster...attack party
        if (fighter.hasCmp("monster")) {
            ZORPG.Player.party.damage(fighter);
        } else if (fighter.actor.isAlive()) { // fighter is a Party character...do action against targeted Monster
            var monster = this.getTargetedMonster();

            switch(action) {
                case "attack":
                    monster.monster.getAttacked(fighter);

                    if (!monster.monster.isAlive()) { // Killed monster -> removed
                        console.log("ZORPG.State.combat: Monster killed", monster)
                        ZORPG.$.remove(this.combatQ, monster);
                    }
                    break;
                default:
                    console.log("ZORPG.State.combat: Character passed the turn.", fighter);
                    break;
            }
        }

        this.combatIndex++; if (this.combatIndex >= this.combatQ.length) this.combatIndex = 0;
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

        // Checking if turn is begining
        if (this.combatIndex === 0) {
            this.beginTurn();
        }

        // Are there monsters left? If not...return to play state
        if (this.combatQ.length > this.getAliveChars().length) {
            // Perform actions until human
            while (this.combatQ.length > this.combatIndex && this.combatQ[this.combatIndex].hasCmp("monster")) {
                this.action();
            }

            // Is the party still alive?
            if (!ZORPG.Player.party.isAlive()) {
                alert("GAME OVER!"); // TODO: please...
                ZORPG.State.set("main_menu");
            } else {
                // Ready for the first human
                this.render();
            }
        } else {
            ZORPG.State.set("play");
        }
    },

    // Update graphics
    render: function() {
        var _this = this;
        ZORPG.Canvas.setHUD("combat", { monsters: this.combatQ });
        ZORPG.Canvas.update(function() { 
            ZORPG.Canvas.highlightChar(_this.combatQ[_this.combatIndex]);
            console.log("ZORPG.State.combat: Update completed")
        });
    },

    destroy: function() {
        this.combatQ = [];
        this.combatIndex = 0;
        this.combatTarget = 0;
        this.combatLoot = {xp:0,gold:0,gems:0};
        ZORPG.Canvas.highlightChar();
        ZORPG.Key.removeAll();
    }
});
