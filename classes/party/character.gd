class_name Character

enum Gender { Male, Female }
enum Profession { Knight, Paladin, Barbarian }

static var names: Array[String] = [
    "Gareth",
    "Sir Canegm",
    "Crag Hack",
    "Resurrectra",
    "Sir Gawain",
    "Arya",
    "Mark",
    "Jeno",
    "Arthur",
    "Valkyria",
    "Olenna",
    "Onna",
    "Vera",
    "Alyxx",
    "Sir Lancelot",
    "Leprosy",
    "Celestino",
    "Edmund",
    "Kerrick",
    "Rhaenyra",
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

func _init() -> void:
    self.portrait = randi() % 24
    print(self.portrait)
    self.name = names[randi() % names.size()]
    self.hp = randi() % 100 + 1
    self.speed = randi() % 10 + 1
    self.might = randi() % 10 + 1
    self.endurance = randi() % 10 + 1
    self.personality = randi() % 10 + 1
    self.intelligence = randi() % 10 + 1
    self.profession = randi() % 3
    if randi() % 2 == 0:
        self.gender = Gender.Male
    else:
        self.gender = Gender.Female

func get_gender() -> String:
    return Gender.keys()[self.gender]

func get_profession() -> String:
    return Profession.keys()[self.profession]
