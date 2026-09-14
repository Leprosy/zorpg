extends TabContainer

var state_data: State

func set_data(new_state_data: State) -> void:
    self.state_data = new_state_data
    self.get_quests(true)

func get_quests(active: bool) -> void:
    var list = $Quest/ScrollContainer/VBoxContainer
    for child: Node in list.get_children():
        child.queue_free()
    for quest in self.state_data.quests:
        if active and quest.status != Quest.Status.Active:
            continue
        var label = Label.new()
        label.text = "%s - %s" % [quest.id, quest.desc]
        if quest.status != Quest.Status.Active:
            label.text += " - Done"
        list.add_child(label)

func _on_close_pressed() -> void:
    self.hide()

func _on_all_pressed() -> void:
    self.get_quests(false)

func _on_active_pressed() -> void:
    self.get_quests(true)
