class_name State

var party: Party
var quests: Array[Quest]
var gold: int
var gems: int

func _init() -> void:
    self.gold = 3000
    self.gems = 100
    self.party = Party.new()

func add_quest(id: String, desc: String) -> void:
    if self.has_quest(id):
        return
    var quest = Quest.new(id, desc)
    self.quests.push_back(quest)

func has_quest(id: String) -> bool:
    return self.quests.any(func (elem: Quest): return elem.id == id)

func has_completed_quest(id: String) -> bool:
    return self.quests.any(func (elem: Quest): return elem.id == id \
        and elem.status == Quest.Status.Completed)

func update_quest(id: String, status: Quest.Status) -> void:
    for quest in self.quests:
        if quest.id == id:
            quest.status = status
