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
    }
}