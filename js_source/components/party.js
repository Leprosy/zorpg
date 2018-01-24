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
    isAlive: function() {
        for (var i = 0; i < this.actors.length; ++i) {
            if (this.actors.isAlive()) {
                return true;
            }
        }

        return false;
    },

    // Damage a number of chars
    damage: function(ent) {
        for (var i = 0; i < ent.monster.attacks; ++i) {
            var index = Math.round(Math.random() * (this.actors.length - 1));
            console.log("ZORPG.Component.party: Actor picked to be attacked:", index, this.actors[index]);
            this.actors[index].actor.damage(ent);
        }
    }
}