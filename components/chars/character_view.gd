extends TabContainer

const MAX_ITEMS = 20

var char_data: Character
var selected_item_index: int = -1

func set_data(data: Character) -> void:
    self.char_data = data
    $Items/Details.hide()
    self.render_stats()
    self.render_items()

func render_stats() -> void:
    var data = self.char_data
    $Stats/Name.text = "%s: %s %s" % [data.name, data.get_gender(), data.get_profession() ]
    $Stats/Mgt/Value.text = "%s" % data.might
    $Stats/End/Value.text = "%s" % data.endurance
    $Stats/Spd/Value.text = "%s" % data.speed
    $Stats/Int/Value.text = "%s" % data.intelligence
    $Stats/Per/Value.text = "%s" % data.personality

func render_items() -> void:
    var data = self.char_data
    var items = self.char_data.items
    $Items/Name.text = "Items for %s the %s" % [data.name, data.get_profession()]
    for child in $Items/Grid.get_children():
       child.queue_free()
    var index = 0
    for item: Item in items:
        var comp = ItemComponent.create(item.type, item.equiped) as ItemComponent
        comp.connect("gui_input", self._on_item_pressed.bind(item, index))
        $Items/Grid.add_child(comp)
        if index == self.selected_item_index:
            comp.set_selected(true)
        index += 1
    for i in range(0, MAX_ITEMS - len(items)):
        var comp = ItemComponent.create(-1, false)
        $Items/Grid.add_child(comp)

func _on_item_pressed(event: InputEvent, data: Item, index: int) -> void:
    if event is InputEventMouseButton and not event.pressed:
        if self.selected_item_index >= 0:
            $Items/Grid.get_children()[self.selected_item_index].set_selected(false)
        self.selected_item_index = index
        $Items/Details.show()
        $Items/Details/Name.text = data.name
        $Items/Details/Icon.frame = data.type * 4
        $Items/Details/Data.text = "ac: %s\ndmg: %s" % [data.ac, data.dmg]
        $Items/Grid.get_children()[self.selected_item_index].set_selected(true)

func _on_equip_pressed() -> void:
    var equiped = self.char_data.items[self.selected_item_index].equiped
    self.char_data.items[self.selected_item_index].equiped = not equiped
    self.render_items()

func _on_close_pressed() -> void:
    self.visible = false
