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

    samePos: function(pos) {
        return this.x === pos.x && this.y === pos.y;
    },

    seek: function(pos) {
        // Basic seek algorithm for monsters
        // TODO: add blocks for monsters(can swim? can enter certain tiles?)
        var angle = pos.ang % Math.PI / 2;
        var threshold = 3;
        console.log("ZORPG.Component.pos: Seeking from", this.x, this.y, " to ", pos.x, pos.y, "angle", angle)

       // If not near, forget it
       if (Math.abs(pos.x - this.x) <= threshold && Math.abs(pos.y - this.y) <= threshold) {
           console.log("ZORPG.Component.pos: position near, start chasing.")
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

           // TAG...if monster reachs party.
           if (this.samePos(pos)) {
               return true;
           } else {
               return false;
           }
       }
    }
}