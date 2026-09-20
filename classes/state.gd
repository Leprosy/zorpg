class_name State

var party: Party
var quests: Array[Quest]
var quest_items: Array[QuestItem]
var gold: int
var gems: int

func _init() -> void:
    self.gold = 3000
    self.gems = 100
    self.party = Party.new()

    # DEBUG
    var q1 = Quest.new("id1", "Quest debug 1")
    var q2 = Quest.new("id2", "Quest debug 2")
    var q3 = Quest.new("id3", "Quest debug 3")
    var q4 = Quest.new("id4", "Quest debug 4")
    q3.status = Quest.Status.Completed
    self.quests = [q1,q2,q3,q4]
    for i in range(24):
        self.add_quest_item("debug_item_%s" % i, "Debug item %s" % (i + 1), i % 8)

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

func add_quest_item(id: String, desc: String, icon: int) -> void:
    if self.has_quest_item(id):
        for quest_item in self.quest_items:
            if quest_item.id == id:
                quest_item.count += 1
        return
    var quest_item = QuestItem.new(id, desc, icon)
    self.quest_items.push_back(quest_item)

func has_quest_item(id: String) -> bool:
    return self.quest_items.any(func (elem: QuestItem): return elem.id == id)

func has_quest_item_count(id: String, count: int) -> bool:
    return self.quest_items.any(func (elem: QuestItem): return elem.id == id \
        and elem.count >= count)

func update_quest_item(id: String, count: int) -> void:
    for quest_item in self.quest_items:
        if quest_item.id == id:
            quest_item.count = count
