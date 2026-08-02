extends Screen

# All geometries are 1m width/tall/depth
const SPEED = 1

func debug() -> void:
    print($PC/VC/V/Party.position)
    print($PC/VC/V/Party.rotation)
    print($PC/VC/V/Party.basis)
    print($PC/VC/V/Party.global_basis)

func _on_forward_pressed() -> void:
    var tween = get_tree().create_tween()
    var new_position = $PC/VC/V/Party.global_position - $PC/VC/V/Party.global_basis.z * SPEED
    tween.tween_property($PC/VC/V/Party, "position", new_position , 0.15)
    tween.play()
    await tween.finished
    self.debug()

func _on_backwards_pressed() -> void:
    var tween = get_tree().create_tween()
    var new_position = $PC/VC/V/Party.global_position + $PC/VC/V/Party.global_basis.z * SPEED
    tween.tween_property($PC/VC/V/Party, "position", new_position , 0.15)
    tween.play()
    await tween.finished    
    self.debug()

func _on_strafe_left_pressed() -> void:
    var tween = get_tree().create_tween()
    var new_position = $PC/VC/V/Party.global_position - $PC/VC/V/Party.global_basis.x * SPEED
    tween.tween_property($PC/VC/V/Party, "position", new_position , 0.15)
    tween.play()
    await tween.finished
    self.debug()

func _on_strafe_right_pressed() -> void:
    var tween = get_tree().create_tween()
    var new_position = $PC/VC/V/Party.global_position + $PC/VC/V/Party.global_basis.x * SPEED
    tween.tween_property($PC/VC/V/Party, "position", new_position , 0.15)
    tween.play()
    await tween.finished 
    self.debug()

func _on_turn_left_pressed() -> void:
    var tween = get_tree().create_tween()
    var new_position = $PC/VC/V/Party.rotation + Vector3(0, PI / 2, 0)
    tween.tween_property($PC/VC/V/Party, "rotation", new_position , 0.15)
    tween.play()
    await tween.finished
    self.debug()

func _on_turn_right_pressed() -> void:
    var tween = get_tree().create_tween()
    var new_position = $PC/VC/V/Party.rotation - Vector3(0, PI / 2, 0)
    tween.tween_property($PC/VC/V/Party, "rotation", new_position , 0.15)
    tween.play()
    await tween.finished
    self.debug()
