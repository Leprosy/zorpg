// Play loop state
ZORPG.State.add("combat", {
    name: "Combating",
    turnPass: false,
    monsterQueue: [],

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
            _this.turnPass = true;
        });

        // Init monster queue
        this.monsterQueue.push(this.scope.monster);
        this.update();
    },

    update: function() {
        console.log("ZORPG.State.combat: UPDATE")

        // If a turn pass, calculate world entities
        if (this.turnPass) {
            console.log("ZORPG.State.combat: Turn pass.");
            this.turnPass = false;

            // Monsters
            /* for (var i = 0; i < 3; ++i) {
                var combat = ZORPG.Monsters[i].pos.seek(ZORPG.Player.pos);

                if (combat) {
                    ZORPG.State.set("combat", {monster: ZORPG.Monsters[i]});
                }
            } */
        }

        // Render
        ZORPG.Canvas.update(ZORPG.Player.pos);
        $("#console").html("Combat:\nmonsters: " + JSON.stringify(this.monsterQueue) + "\nParty:" + JSON.stringify(ZORPG.Player));
    },

    destroy: function() {
        ZORPG.Key.removeAll();
    }
});
