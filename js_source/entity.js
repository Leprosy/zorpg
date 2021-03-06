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
    if (ZORPG.$.isArray(cmp)) {
        for (var i = 0; i < cmp.length; ++i) {
            this.addCmp(cmp[i]);
        }
    }

    // Chain API
    return this;
};

// Adds a component to the entity
ZORPG.Ent.prototype.addCmp = function(key) {
    if (ZORPG.Components.hasOwnProperty(key)) {
        this[key] = {};
        ZORPG.$.extend(this[key], ZORPG.Components[key]);
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
    for (var i = 0; i < tagList.length; ++i) {
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
    for (var i in cmpList) {
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
ZORPG.Components = {};
