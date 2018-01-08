var ZORPG = ZORPG || {};

/**
 *  Base entity class
 *  
 *  id: unique id of the ent
 *  name: optional name for the ent
 *  tags: list of tags for this ent
 *  data: Placeholder for user data
 *  group: the ent group that holds this ent, if any
 */
ZORPG.Ent = function(name, cmp) {
    // Setup
    this.id = new Date().getTime().toString(16);
    this.name = name;
    this.tags = [];

    // Add components, if any
    if (ZORPG.Utils.isArray(cmp)) {
        for (i = 0; i < cmp.length; ++i) {
            this.addCmp(cmp[i]);
        }
    }

    // Chain API
    return this;
};

// Adds a component to the entity
ZORPG.Ent.prototype.addCmp = function(key) {
    if (ZORPG.Components.hasOwnProperty(key)) {
        this[key] = Object.assign({}, ZORPG.Components[key]);
        return this;
    } else {
        throw Error("ZORPG.Ent: Component '" + key + "' not found");
    }
};
// Removes a component to the entity
ZORPG.Ent.prototype.removeCmp = function(key) {
    delete this[key];
    return this;
};
// Adds a tag to the entity
ZORPG.Ent.prototype.addTag = function(tag) {
    this.tags.push(tag);
    return this;
};
// Removes a tag to the entity
ZORPG.Ent.prototype.removeTag = function(tag) {
    this.tags.splice(this.tags.indexOf(tag), 1);
    return this;
};
// Tests
ZORPG.Ent.prototype.hasTag = function(tag) {
    return this.tags.indexOf(tag) > -1;
};
ZORPG.Ent.prototype.hasAllTags = function(tagList) {
    for (i = 0; i < tagList.length; ++i) {
        if (!this.hasTag(tagList[i])) {
            return false;
        }
    }

    return true;
};
ZORPG.Ent.prototype.hasCmp = function(cmp) {
    return this.hasOwnProperty(cmp);
};
ZORPG.Ent.prototype.hasAllCmp = function(cmpList) {
    for (i in cmpList) {
        if (!this.hasCmp(cmpList[i])) {
            return false;
        }
    }

    return true;
};




/**
 *  Entity group class
 *  
 *  ents: list of entities that this group holds
 */
ZORPG.EntGroup = function() {
    this.ents = [];
}

// Adds an entity to the list
ZORPG.EntGroup.prototype.add = function(ent) {
    this.ents.push(ent);
};
// Removes
ZORPG.EntGroup.prototype.remove = function(ent) {
    
};
// Queries
ZORPG.EntGroup.prototype.queryTags = function(tagList, fn) {
    
};
ZORPG.EntGroup.prototype.queryCmp = function(cmpList) {};


/**
 * Base components
 */
ZORPG.Components = {
    /**
     * pos : Component that provides position, facing angle and methods
     *       to calculate movement coordinates, in order to perform checks on 
     *       a map object and movement.
     */
    "pos": {
        x: 0,
        y: 0,
        ang: 0,

        rotR: function() {
            this.ang = (this.ang + Math.PI / 2) % (Math.PI * 2);
        },
        rotL: function() {
            this.ang = (this.ang - Math.PI / 2) % (Math.PI * 2);
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
    },

    /**
     * party: Attributes of a party. Quests, awards, list of actors, etc.
     */
    "party": {
        gold: 1000,
        gems: 50,
        food: 24,
        quests: {},
        awards: {},
        questItems: {},
        actors: [],

        hasQuest: function(key) {
            return this.quests.hasOwnProperty(key);
        },
        giveQuest: function(args) {
            if (!this.hasQuest(args.questId)) {
                this.quests[args.questId] = args.desc;
            }
        },
        removeQuest: function(key) {
            delete this.quests[key];
        },
        hasAward: function(key) {
            return this.awards.hasOwnProperty(key);
        },
        giveAward: function(args) {
            if (!this.hasAward(args.awardId)) {
                this.awards[args.awardId] = args.desc;
            }
        }
    },

    /**
     * actor: Component that provides actor attributes, like HPs, character stats, etc.
     */
    "actor": {
        hp: 0,
        name: "",
        speed: 0,

        toString: function() {
            return this.name + ":" + this.hp + "hp";
        }
    }
}


/*
}

//Demo
var E = new ZORPG.Ent("taldo");
E.addCmp('cmp1');
E.addCmp('cmp2');
E.addCmp('cmp3');
console.log(JSON.stringify(E));

E.removeCmp('cmp2');
E.removeCmp('none');
console.log(JSON.stringify(E));

E.addTag("tag1");
E.addTag("tag2");
console.log(JSON.stringify(E));

E.removeTag("tag1");
E.removeTag("none");
console.log(JSON.stringify(E));

EG = new ZORPG.EntGroup();
EG.add(); */
