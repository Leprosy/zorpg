/**
 * party: Attributes of a party. Quests, awards, list of actors, etc.
 */
ZORPG.Components.party = {
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
    },

    // Damage & death
    isDead: function() {
        for (var i = 0; i < this.actors.length; ++i) {
            if (this.actors[i].hp > 0) {
                return true;
            }
        }

        return false;
    },

    // Damage a number of chars
    damage: function(chars, damage) {
        for (var i = 0; i < chars; ++i) {
            var ent = this.actors[Math.round(Math.random() * this.actors.length)];
            ent.actor.hp -= damage;
            console.log("ZORPG.Component.party: Actor " + ent.actor + " damaged for " + damage);
        }
    }
}