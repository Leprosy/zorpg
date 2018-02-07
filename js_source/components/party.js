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
            if (this.actors[i].actor.isAlive()) {
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
            this.actors[index].actor.getAttacked(ent);
        }
    },

    // Default party
    generateDefaultParty: function() {
        var data = [{
            name:"Sir Lepro",
            cls: "knight",
            race: "human",
            //hp: 12,
            str: 17,
            int: 13,
            per: 13,
            end: 19,
            spd: 16,
            acc: 15,
            lck: 12
        }, {
            name:"CragHack", // Dwarf, barb
            cls: "barbarian",
            race: "dwarf",
            //hp: 23,
            str: 18,
            int: 7,
            per: 12,
            end: 21,
            spd: 16,
            acc: 17,
            lck: 14
        }, {
            name:"Tyro", // H.orc knight
            cls: "knight",
            race: "half-orc",
            //hp: 16,
            str: 19,
            int: 10,
            per: 8,
            end: 19,
            spd: 16,
            acc: 16,
            lck: 14
        }];

        for (var i = 0; i < 3; ++i) {
            var ent = new ZORPG.Ent("character" + i, ["actor"]);
            ZORPG.$.extend(ent.actor, data[i]);
            ent.actor.init();
            ZORPG.Player.party.actors.push(ent);
        }
    },
}
