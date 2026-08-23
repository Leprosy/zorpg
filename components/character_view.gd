extends Panel

func set_data(data: Character) -> void:
    $Mgt/Value.text = "%s" % data.might
    $End/Value.text = "%s" % data.endurance
    $Spd/Value.text = "%s" % data.speed
    $Int/Value.text = "%s" % data.intelligence
    $Per/Value.text = "%s" % data.personality
    $Name.text = "%s: %s %s" % [data.name, data.get_gender(), data.get_profession() ]

func _on_close_pressed() -> void:
    self.visible = false

func _on_items_pressed() -> void:
    $ItemsView.show()

func _on_items_view_close_pressed() -> void:
    $ItemsView.hide()
