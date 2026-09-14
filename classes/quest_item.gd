class_name QuestItem

var id: String
var desc: String
var count: int

func _init(new_id: String, new_desc: String) -> void:
    self.id = new_id
    self.desc = new_desc
    self.count = 1
