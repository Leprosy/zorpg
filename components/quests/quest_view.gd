extends TabContainer

var state_data: State
var selected_item_index: int = -1

func set_data(new_state_data: State) -> void:
    self.state_data = new_state_data
    $Items/Details.hide()
    self.selected_item_index = -1
    self.get_quests(true)
    self.render_items()

func get_quests(active: bool) -> void:
    var list = $Quest/ScrollContainer/VBoxContainer
    for child: Node in list.get_children():
        list.remove_child(child)
        child.queue_free()
    for quest in self.state_data.quests:
        if active and quest.status != Quest.Status.Active:
            continue
        var label = Label.new()
        label.text = "%s - %s" % [quest.id, quest.desc]
        if quest.status != Quest.Status.Active:
            label.text += " - Done"
        list.add_child(label)

func render_items() -> void:
    var grid = $Items/ScrollContainer/Grid
    for child in grid.get_children():
        grid.remove_child(child)
        child.queue_free()
    var index = 0
    for quest_item: QuestItem in self.state_data.quest_items:
        var comp = ItemComponent.create(quest_item.icon, false) as ItemComponent
        comp.connect("gui_input", self._on_item_pressed.bind(quest_item, index))
        grid.add_child(comp)
        if index == self.selected_item_index:
            comp.set_selected(true)
        index += 1

func _on_item_pressed(event: InputEvent, data: QuestItem, index: int) -> void:
    if event is InputEventMouseButton and not event.pressed:
        var grid = $Items/ScrollContainer/Grid
        if self.selected_item_index >= 0:
            grid.get_children()[self.selected_item_index].set_selected(false)
        self.selected_item_index = index
        $Items/Details.show()
        $Items/Details/Name.text = data.desc
        $Items/Details/Icon.frame = data.icon * 4
        $Items/Details/Data.text = "x%s" % data.count
        grid.get_children()[self.selected_item_index].set_selected(true)

func _on_close_pressed() -> void:
    self.hide()

func _on_all_pressed() -> void:
    self.get_quests(false)

func _on_active_pressed() -> void:
    self.get_quests(true)
