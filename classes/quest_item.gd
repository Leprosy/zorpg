class_name QuestItem

var id: String
var desc: String
var count: int
var icon: int

func _init(new_id: String, new_desc: String, new_icon: int) -> void:
    self.id = new_id
    self.desc = new_desc
    self.icon = new_icon
    self.count = 1
