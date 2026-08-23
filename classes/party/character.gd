class_name Character

enum Gender { Male, Female }
enum Profession { Knight, Paladin, Barbarian }

static var female_names: Array[String] = [
    "Resurrectra",
    "Arya",
    "Valkyria",
    "Olenna",
    "Onna",
    "Vera",
    "Alyxx",
    "Rhaenyra",
    "Paradise",
    "Celestina",
    "Lyanna",
    "Arwen"
]
static var male_names: Array[String] = [
    "Gareth",
    "Sir Canegm",
    "Crag Hack",
    "Sir Gawain",
    "Mark",
    "Jeno",
    "Arthur",
    "Sir Lancelot",
    "Leprosy",
    "Celestino",
    "Edmund",
    "Kerrick",
    "Lord Stark",
]

var name: String
var hp: int
var portrait: int
var gender: Gender
var profession: Profession

var speed: int
var might: int
var personality: int
var intelligence: int
var endurance: int

var items: Array[Item]

func _init() -> void:
    self.portrait = randi() % 24
    print(self.portrait)
    self.hp = randi() % 100 + 1
    self.speed = randi() % 10 + 1
    self.might = randi() % 10 + 1
    self.endurance = randi() % 10 + 1
    self.personality = randi() % 10 + 1
    self.intelligence = randi() % 10 + 1
    self.profession = randi() % 3 as Profession
    if randi() % 2 == 0:
        self.gender = Gender.Male
    else:
        self.gender = Gender.Female
    var names = female_names if self.gender == Gender.Female else male_names
    self.name = names[randi() % names.size()]

    for i in range(0, 3 + randi() % 5):
        self.items.append(Item.new())
    print(self.items)

func get_gender() -> String:
    return Gender.keys()[self.gender]

func get_profession() -> String:
    return Profession.keys()[self.profession]
