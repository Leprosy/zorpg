var ZORPG = {};

ZORPG.Ent = function(name, cmp) {
    this.id = new Date().getTime().toString(16);
    this.name = name;
};

// Adds a component to the entity
ZORPG.Ent.prototype.addCmp = function(key) {
    this[key] = { component: key, data: []};
};

// Removes a component to the entity
ZORPG.Ent.prototype.removeCmp = function(key) {
    this[key] = null;
};




// Demo
var E = new ZORPG.Ent("taldo");
E.addCmp('uno');
E.addCmp('dos');
E.addCmp('tres');
console.log(E);
