extends Panel

const MAX_ITEMS = 20

var char_data: Character
var item_index: int

func set_data(data: Character) -> void:
    self.char_data = data
    $Mgt/Value.text = "%s" % data.might
    $End/Value.text = "%s" % data.endurance
    $Spd/Value.text = "%s" % data.speed
    $Int/Value.text = "%s" % data.intelligence
    $Per/Value.text = "%s" % data.personality
    $Name.text = "%s: %s %s" % [data.name, data.get_gender(), data.get_profession() ]
    $ItemsView/ItemsName.text = "Items for %s the %s" % [data.name, data.get_profession()]
    self.render_items()

func render_items() -> void:
    var items = self.char_data.items
    for child in $ItemsView/ItemsGrid.get_children():
       child.queue_free()
    var index = 0
    for item: Item in items:
        var comp = ItemComponent.create(item.type, item.equiped)
        comp.connect("gui_input", self.item_click.bind(item, index))
        $ItemsView/ItemsGrid.add_child(comp)
        index += 1
    for i in range(0, MAX_ITEMS - len(items)):
        var comp = ItemComponent.create(-1, false)
        $ItemsView/ItemsGrid.add_child(comp)

func _on_close_pressed() -> void:
    self.visible = false

func item_click(event: InputEvent, data: Item, index: int) -> void:
    if event is InputEventMouseButton and not event.pressed:
        item_index = index
        $ItemsView/ItemDetails/Name.text = data.name
        $ItemsView/ItemDetails/Icon.frame = data.type * 4
        $ItemsView/ItemDetails/Data.text = "ac: %s\ndmg: %s" % [data.ac, data.dmg]

# TODO: Consider using tabs instead, if we want to implement another screen here
func _on_items_pressed() -> void:
    $ItemsView.show()

func _on_items_view_close_pressed() -> void:
    $ItemsView.hide()

func _on_equip_pressed() -> void:
    var equiped = self.char_data.items[self.item_index].equiped
    self.char_data.items[self.item_index].equiped = not equiped
    self.render_items()
