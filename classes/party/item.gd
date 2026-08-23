class_name Item

enum Type { Weapon, Armor, Helm, Boot, Gauntlet, Ring, Amulet, Projectile }

var name: String
var ac: int
var dmg: int # TODO: this should be a dice string
var equiped: bool
var type: Type

func _init() -> void:
    self.name = "Test Item %s" % (randi() % 1000)
    self.ac = randi() % 10
    self.dmg = randi() % 10
    self.equiped = false
    self.type = randi() % 8 as Type
