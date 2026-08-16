class_name Character

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

var speed: int
var might: int
var endurance: int

func _init() -> void:
    self.portrait = randi() % 24
    print(self.portrait)
    self.name = names[randi() % names.size()]
    self.hp = randi() % 100 + 1
    self.speed = randi() % 10 + 1
    self.might = randi() % 10 + 1
    self.endurance = randi() % 10 + 1
