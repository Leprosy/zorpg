ZORPG.Tables = {
    /**
     * Classes table
Class       HP Attacks  Skill            Spells         Requirements
Knight      10       5  Arms Master      -              Mgt 15
Paladin      8       6  Crusader         Light          Mgt/Per/End 13
Archer       7       6  -                Detect Magic   Int/Acy 13
Cleric       5       7  -                All L1 Cleric  Per 13
Sorcerer     4       8  Cartography      All L1 Sorc.   Int 13
Robber       8       6  Thievery         -              Lck 13
Ninja        7       5  Thievery         -              Spd/Acy 13
Barbarian   12       4  -                -              End 15
Druid        6       7  Direction Sense  All L1 Druid   Int/Per 15
Ranger       9       6  Pathfinding      Awaken         Int/Per/End/Spd 12
     */
    cls: {
        "knight": { hp: 10, at: 5, skill: "arms master"},
        "barbarian": { hp: 12, at: 4, skill: ""},
        "sorcerer": { hp: 4, at: 8, skill: "cartography" }
    },

    /**
     * Races table
Name      HPLevel MPLevel Fire Elec Cold Pois Ener Magic   ThMod Skill
Human        +0     +0    7    7    7    7    7     7    +0 Swimming
Elf          -2    +2*    0    0    0    0    5     5   +10 -
Dwarf        +1     -1    5    5    5   20    5     0    +5 Spot Secret Doors
Gnome        -1     +1    2    2    2    2    2    20   +10 Danger Sense
Half-orc     +2     -2   10   10   10    0    0     0   -10 -
     */
    race: {
        "human": { hp: 0, sp: 0, skill: "swimming"},
        "dwarf": { hp: 1, sp: -1, skill: "swimming"},
        "half-orc": { hp: 2, sp: -2, skill: "" },
    },

    /**
     * Stat modifier table
0-2           Nonexistant [sic]  -5
3-4           Very Poor          -4
5-6           Poor               -3
7-8           Very Low           -2
9-10          Low                -1
11-12         Average            +0
13-14         Good               +1
15-16         Very Good          +2
17-18         High               +3
19-20         Very High          +4
21-24         Great              +5
25-29         Super              +6
30-34         Amazing            +7
35-39         Incredible         +8
40-49         Gigantic           +9
50-74         Fantastic         +10
75-99         Astounding        +11
100-124       Astonishing       +12
125-149       Monumental        +13
150-174       Tremendous        +14
175-199       Collosal [sic]    +15
200-224       Awesome           +16
225-249       Awe Inspiring     +17
250+          Ultimate          +20
     */
    getStatBonus: function(stat) {
        if (stat >= 250) return {value: 20, name: "Ultimate"}
        if (stat >= 225) return {value: 17, name: "Awe Inspiring"}
        if (stat >= 200) return {value: 16, name: "Awesome"}
        if (stat >= 175) return {value: 15, name: "Collosal"}
        if (stat >= 150) return {value: 14, name: "Tremendous"}
        if (stat >= 125) return {value: 13, name: "Monumental"}
        if (stat >= 100) return {value: 12, name: "Astonishing"}
        if (stat >= 75) return {value: 11, name: "Astounding"}
        if (stat >= 50) return {value: 10, name: "Fantastic"}
        if (stat >= 40) return {value: 9, name: "Gigantic"}
        if (stat >= 35) return {value: 8, name: "Incredible"}
        if (stat >= 30) return {value: 7, name: "Amazing"}
        if (stat >= 25) return {value: 6, name: "Super"}
        if (stat >= 21) return {value: 5, name: "Great"}
        if (stat >= 19) return {value: 4, name: "Very High"}
        if (stat >= 17) return {value: 3, name: "High"}
        if (stat >= 15) return {value: 2, name: "Very Good"}
        if (stat >= 13) return {value: 1, name: "Good"}
        if (stat >= 11) return {value: 0, name: "Average"}
        if (stat >= 9) return {value: -1, name: "Low"}
        if (stat >= 7) return {value: -2, name: "Very Low"}
        if (stat >= 5) return {value: -3, name: "Poor"}
        if (stat >= 3) return {value: -4, name: "Very Poor"}
        if (stat >= 0) return {value: -5, name: "Nonexistant"}
    },


/**Items
 * 
 * 
 */

    item: {
        "short sword": { ac: 0, dmg: "1d5+1", exclude: "", type: "weapon"},
        "long sword": { ac: 0, dmg: "1d7+2", exclude: "", type: "weapon"},
        "katana": { ac: 0, dmg: "1d9+3", exclude: "", type: "weapon"},

        "boots": { ac: 1, dmg: "", exclude: "", type: "shoe"},
        "cape": { ac: 1, dmg: "", exclude: "", type: "cape"},

        "cap": { ac: 1, dmg: "", exclude: "", type: "helm"},
        "helm": { ac: 2, dmg: "", exclude: "", type: "helm"},

        "chain mail": { ac: 6, dmg: "", exclude: "", type: "armor"},
        "plate armor": { ac: 8, dmg: "", exclude: "", type: "armor"},

        "buckler": { ac: 2, dmg: "", exclude: "", type: "shield"},
        "shield": { ac: 4, dmg: "", exclude: "", type: "shield"},

        "belt": { ac: 0, dmg: "", exclude: "", type: "belt"},
        "medal": { ac: 0, dmg: "", exclude: "", type: "medal"},
        "amulet": { ac: 0, dmg: "", exclude: "", type: "amulet"},
        "ring": { ac: 0, dmg: "", exclude: "", type: "ring"},
    },

    material: {
        "leather": { dmg: -6, toHit: -4, ac: 0 },
        "bronze": { dmg: -2, toHit: 2, ac: -1 },
        "iron": { dmg: 2, toHit: 1, ac: 1 },
        "gold": { dmg: 8, toHit: 4, ac: 6 },
        "obsidian": { dmg: 50, toHit: 10, ac: 20 }
    }
}