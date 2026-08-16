class_name CharPortrait
extends Panel

func set_face(id: int) -> void:
    $Sprite2D.frame = id % $Sprite2D.hframes

func set_status(id: int) -> void:
    $Sprite2D.frame = $Sprite2D.frame + $Sprite2D.hframes * id
