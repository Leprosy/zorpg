extends Screen

const SPEED = 1 # All geometries are 1m width/tall/depth
const CAMERA_SHAKE_BLOCKED_MOVE = 0.005
const CAMERA_SHAKE_PERIOD = 0.15
const MOVE_DURATION = 0.075



func get_map() -> GameMap:
    var map_holder = $PC/VC/V/CurrentMap
    return map_holder.get_children()[0]

func _execute_move(direction: Vector3) -> void:
    var new_position = $PC/VC/V/Party.global_position + direction * SPEED
    var is_passable = self.get_map().is_cell_passable(new_position)
    if not is_passable:
        self._camera_shake(CAMERA_SHAKE_BLOCKED_MOVE)
        return
    var tween = get_tree().create_tween()
    tween.tween_property($PC/VC/V/Party, "position", new_position , MOVE_DURATION)
    tween.play()
    await tween.finished
    get_map().get_cell_script(new_position)

func _camera_shake(magnitude: float) -> void:
    var camera = $PC/VC/V/Party/Camera3D
    var initial_transform: Transform3D = camera.transform # Store the full initial transform of the camera
    var elapsed_time: float = 0.0
    while elapsed_time < CAMERA_SHAKE_PERIOD:
        var offset = Vector3(randf_range(-magnitude, magnitude),
                            randf_range(-magnitude, magnitude),
                            0.0)
        camera.transform.origin = initial_transform.origin + offset
        elapsed_time += get_process_delta_time()
        await get_tree().process_frame
    camera.transform = initial_transform # Reset back to the original transform

func _on_forward_pressed() -> void:
    self._execute_move(-$PC/VC/V/Party.global_basis.z)

func _on_backwards_pressed() -> void:
    self._execute_move($PC/VC/V/Party.global_basis.z)

func _on_strafe_left_pressed() -> void:
    self._execute_move(-$PC/VC/V/Party.global_basis.x)

func _on_strafe_right_pressed() -> void:
    self._execute_move($PC/VC/V/Party.global_basis.x)

func _execute_turn(direction: int) -> void:
    var tween = get_tree().create_tween()
    var new_position = $PC/VC/V/Party.rotation + Vector3(0, direction * PI / 2, 0)
    tween.tween_property($PC/VC/V/Party, "rotation", new_position , MOVE_DURATION)
    tween.play()
    await tween.finished

func _on_turn_left_pressed() -> void:
    self._execute_turn(1)

func _on_turn_right_pressed() -> void:
    self._execute_turn(-1)
