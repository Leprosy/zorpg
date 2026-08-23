class_name Quest

enum Status { Active, Completed, Failed }

var id: String
var desc: String
var status: Status

func _init(new_id: String, new_desc: String) -> void:
    self.id = new_id
    self.desc = new_desc
    self.status = Status.Active
