extends Panel

func _on_button_pressed() -> void:
    self.visible = false

func set_data(data: Character) -> void:
    $Mgt/Value.text = "%s" % data.might
    $End/Value.text = "%s" % data.endurance
    $Spd/Value.text = "%s" % data.speed
    $Int/Value.text = "%s" % data.intelligence
    $Per/Value.text = "%s" % data.personality
    $Name.text = "%s: %s %s" % [data.name, data.get_gender(), data.get_profession() ]
