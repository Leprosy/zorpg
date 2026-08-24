class_name ItemComponent
extends Panel

static var scene = preload("res://components/items/item.tscn")

static func create(type: int, equiped: bool):
    var instance = scene.instantiate()
    instance.setup(type, equiped)
    return instance

func setup(type: int, equiped: bool) -> void:
    $Icon.frame = type * 4
    $Equiped.visible = equiped
    if type < 0:
        $Icon.hide()
    else:
        $Icon.show()

func set_selected(val: bool):
    $Selected.visible = val
