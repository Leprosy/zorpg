class_name State

var party: Party
var quests: Array[Quest]
var gold: int
var gems: int

func _init() -> void:
    self.gold = 3000
    self.gems = 100
    self.party = Party.new()
