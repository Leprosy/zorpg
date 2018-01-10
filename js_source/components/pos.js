/**
 * pos : Component that provides position, facing angle and methods
 *       to calculate movement coordinates, in order to perform checks on 
 *       a map object and movement.
 */
ZORPG.Components.pos = {
    x: 0,
    y: 0,
    ang: 0,

    rotR: function() {
        this.ang = (this.ang + Math.PI / 2)// % (Math.PI * 2);
    },
    rotL: function() {
        this.ang = (this.ang - Math.PI / 2)// % (Math.PI * 2);
    },
    getFwd: function() {
        var x = Math.round(this.x + Math.sin(this.ang));
        var y = Math.round(this.y + Math.cos(this.ang));

        return { x: x, y : y};
    },
    getBck: function() {
        var x = Math.round(this.x - Math.sin(this.ang));
        var y = Math.round(this.y - Math.cos(this.ang));

        return { x: x, y : y};
    },
    moveFwd: function() {
        var pos = this.getFwd();
        this.x = pos.x;
        this.y = pos.y;
    },
    moveBck: function() {
        var pos = this.getBck();
        this.x = pos.x;
        this.y = pos.y;
    },

    toString: function() {
        return this.x + "-" + this.y;
    },

    seek: function(pos) {
        var angle = pos.angle % Math.PI / 2;

        var threshold = 3;
        // Basic seek algorithm
        console.log("SEEK, checking", "monster", this.x, this.y, "position", pos.x, pos.y)

       // If not near, forget it
       if (Math.abs(pos.x - this.x) <= threshold && Math.abs(pos.y - this.y) <= threshold) {
           // Backup coords.
           var oldX = this.x;
           var oldY = this.y;

           // If angle is horizontal, try to match vertical coordinate first, and viceversa
           var first = "y", second = "x";

           if (angle === 0 || angle === -Math.PI / 2) {
               first = "x"; second = "y"
           }

           // Try to match first coordinate, then the second one
           if (pos[first] > this[first]) {
               this[first]++;
           } else if (pos[first] < this[first]) {
               this[first]--;
           } else {
               if (pos[second] > this[second]) {
                   this[second]++;
               } else if (pos[second] < this[second]){
                   this[second]--;
               }
           }

           // TAG...if monster reachs party, push to the queue.
           /* if (this.samePos(party)) {
               if (Game.playState.combat.add(this)) {
                   console.log("Game.Monster: Monster added to combat queue", this)
                   Game.playState.gameStatus = Game.FIGHTING;
                   this.setPosition(this.x, this.y);
               } else {
                   this.x = oldX;
                   this.y = oldY;
               }
           } else {
               this.setPosition(this.x, this.y);
           } */
       }
    }
}