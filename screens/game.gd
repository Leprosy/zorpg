extends Screen

# All geometries are 1m width/tall/depth
const SPEED = 1

func debug() -> void:
    var grid = $PC/VC/V/GridMap
    var local_pos = grid.to_local($PC/VC/V/Party.position)
    print(local_pos)
    var map_pos = grid.local_to_map(local_pos)
    print(map_pos)
    var cell_id = grid.get_cell_item(map_pos)
    print(cell_id)
    var mesh = grid.mesh_library.get_item_navigation_layers(cell_id)
    print(mesh)

# Check if the move is valid using the navigation layers
# The navigation layers are:
# 1: Default
# 2: Impassable
func _check_move_valid(position: Vector3) -> bool:
    var grid = $PC/VC/V/GridMap
    var local_pos = grid.to_local(position)
    var map_pos = grid.local_to_map(local_pos)
    var cell_id = grid.get_cell_item(map_pos)
    if cell_id == -1:
        return false
    var mesh = grid.mesh_library.get_item_navigation_layers(cell_id)
    print(mesh)
    return mesh == 1

func _execute_move(direction: Vector3) -> void:
    var new_position = $PC/VC/V/Party.global_position + direction * SPEED
    if not self._check_move_valid(new_position):
        return
    var tween = get_tree().create_tween()
    tween.tween_property($PC/VC/V/Party, "position", new_position , 0.15)
    tween.play()
    await tween.finished
    self.debug()

func _on_forward_pressed() -> void:
    self._execute_move(-$PC/VC/V/Party.global_basis.z)

func _on_backwards_pressed() -> void:
    self._execute_move($PC/VC/V/Party.global_basis.z)

func _on_strafe_left_pressed() -> void:
    self._execute_move(-$PC/VC/V/Party.global_basis.x)

func _on_strafe_right_pressed() -> void:
    self._execute_move($PC/VC/V/Party.global_basis.x)

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
