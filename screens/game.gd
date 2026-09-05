extends Screen

const SPEED = 1 # All geometries are 1m width/tall/depth
const CAMERA_SHAKE_BLOCKED_MOVE = 0.005
const CAMERA_SHAKE_PERIOD = 0.15
const MOVE_DURATION = 0.075

var char_portrait_scene = preload("res://components/chars/char-portrait.tscn")

func _ready() -> void:
    var state = self.app_root.state
    var x = 0
    for character: Character in state.party.chars:
        var portrait: CharPortrait = char_portrait_scene.instantiate()
        portrait.position.x = x
        $Characters.add_child(portrait)
        portrait.set_face(character.portrait)
        portrait.connect("gui_input", self._on_portrait_click.bind(character))
        x += 90

    self.load_map("test_map")

func _on_portrait_click(event: InputEvent, data: Character):
    if event is InputEventMouseButton and not event.pressed:
        $CharacterView.visible = true
        $CharacterView.set_data(data)

## Helpers
func get_map() -> GameMap:
    var map_holder = $PC/VC/V/CurrentMap
    return map_holder.get_children()[0]

func camera_shake(magnitude: float) -> void:
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


## Movement functions
func _on_forward_pressed() -> void:
    self._execute_move(-$PC/VC/V/Party.global_basis.z)

func _on_backwards_pressed() -> void:
    self._execute_move($PC/VC/V/Party.global_basis.z)

func _on_strafe_left_pressed() -> void:
    self._execute_move(-$PC/VC/V/Party.global_basis.x)

func _on_strafe_right_pressed() -> void:
    self._execute_move($PC/VC/V/Party.global_basis.x)

func _on_turn_left_pressed() -> void:
    self._execute_turn(1)

func _on_turn_right_pressed() -> void:
    self._execute_turn(-1)

func _execute_move(direction: Vector3) -> void:
    var party = $PC/VC/V/Party
    var new_position = party.global_position + direction * SPEED
    var is_passable = self.get_map().is_cell_passable(new_position)
    if not is_passable:
        self.camera_shake(CAMERA_SHAKE_BLOCKED_MOVE)
        return
    var tween = get_tree().create_tween()
    tween.tween_property(party, "position", new_position , MOVE_DURATION)
    tween.play()
    await tween.finished
    get_map().get_cell_script(new_position)
    
func _execute_turn(direction: int) -> void:
    var party = $PC/VC/V/Party
    var tween = get_tree().create_tween()
    var new_position = party.rotation + Vector3(0, direction * PI / 2, 0)
    tween.tween_property(party, "rotation", new_position , MOVE_DURATION)
    tween.play()
    await tween.finished


## Script calls - TODO refactor these into another module?
func show_npc_dialog(title: String, content: String, npc: int) -> void:
    $NpcDialog.show_content(title, content, npc)

func hide_npc_dialog() -> void:
    $NpcDialog.hide()

func show_wide_dialog(content: String) -> void:
    $WideDialog.show_content(content)

func hide_wide_dialog() -> void:
    $WideDialog.hide()

func load_map(id: String) -> void:
    self.show_wide_dialog("Loading map...")
    var map = $PC/VC/V/CurrentMap.get_children() as Array[GameMap]
    if len(map):
        map[0].queue_free()

    var res = load("res://data/maps/%s.tscn" % id)
    var inst = res.instantiate()
    $PC/VC/V/CurrentMap.add_child(inst)
    # Position of the party. TODO: this can come from map metadata?
    $PC/VC/V/Party.position.x = 0
    $PC/VC/V/Party.position.z = 0
    self.hide_wide_dialog()

# Debug
func _on_button_9_pressed() -> void:
    if $NpcDialog.visible:
        self.hide_npc_dialog()
        self.hide_wide_dialog()
    else:
        self.show_npc_dialog("Sir Leprosy", "This is a test dialog created to test this", 10)
        self.show_wide_dialog("Mmmm...this is working")

func _on_button_8_pressed() -> void:
    self.load_map("taldo")


func _on_button_7_pressed() -> void:
    self.load_map("test_map")
