class_name CharPortrait
extends Panel

func set_face(id: int) -> void:
    $Portrait.frame = id % $Portrait.hframes

func set_condition(id: int) -> void:
    $Portrait.frame = $Portrait.frame + $Portrait.hframes * id

func set_status(id: int) -> void:
    $Status.frame = id % $Status.hframes
