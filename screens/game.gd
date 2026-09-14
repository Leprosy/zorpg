extends Screen

const SPEED = 1 # All geometries are 1m width/tall/depth
const CAMERA_SHAKE_BLOCKED_MOVE = 0.005
const CAMERA_SHAKE_PERIOD = 0.15
const MOVE_DURATION = 0.075

var char_portrait_scene = preload("res://components/chars/char-portrait.tscn")
var is_scripting = false
var script_runner: Runner

func _ready() -> void:
    var state = self.app_root.state
    for character: Character in state.party.chars:
        var portrait: CharPortrait = char_portrait_scene.instantiate()
        portrait.custom_minimum_size.x = 84
        $Characters.add_child(portrait)
        portrait.set_face(character.portrait)
        portrait.connect("gui_input", self._on_portrait_click.bind(character))
    self.load_map("test_map")


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

func is_viewing_stats() -> bool:
    return $CharacterView.visible or $QuestView.visible


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
    if is_scripting or self.is_viewing_stats():
        return
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
    var script = get_map().get_cell_script(new_position)
    if len(script):
        self.script_runner = Runner.new(script, self)
    else:
        self.script_runner = null

func _execute_turn(direction: int) -> void:
    if is_scripting or self.is_viewing_stats():
        return
    var party = $PC/VC/V/Party
    var tween = get_tree().create_tween()
    var new_position = party.rotation + Vector3(0, direction * PI / 2, 0)
    tween.tween_property(party, "rotation", new_position , MOVE_DURATION)
    tween.play()
    await tween.finished


# Commands buttons & similar stuff
func _on_yes_pressed() -> void:
    self.script_runner.set_cond(true)
    self.script_runner.run()

func _on_no_pressed() -> void:
    self.script_runner.set_cond(false)
    self.script_runner.run()

func _on_pc_gui_input(event: InputEvent) -> void:
    if event is InputEventMouseButton and not event.pressed:
        if self.script_runner:
            if not self.is_scripting:
                self.is_scripting = true
            self.script_runner.run()

func _on_portrait_click(event: InputEvent, data: Character):
    if is_scripting or $QuestView.visible:
        return
    if event is InputEventMouseButton and not event.pressed:
        $CharacterView.show()
        $CharacterView.set_data(data)

func _on_quests_pressed() -> void:
    if is_scripting or self.is_viewing_stats():
        return
    $QuestView.show()
    $QuestView.set_data(self.app_root.state)

## Script calls - TODO refactor these into another module?
func show_npc_dialog(title: String, content: String, npc: int) -> void:
    $NpcDialog.show_content(title, content, npc)

func hide_npc_dialog() -> void:
    $NpcDialog.hide()

func show_wide_dialog(content: String) -> void:
    $WideDialog.show_content(content)

func hide_wide_dialog() -> void:
    $WideDialog.hide()

func show_confirm_dialog() -> void:
    $CommandButtons.hide()
    $ConfirmButtons.show()

func hide_confirm_dialog() -> void:
    $CommandButtons.show()
    $ConfirmButtons.hide()

func add_quest(id: String, desc: String) -> void:
    var state = self.app_root.state
    state.add_quest(id, desc)

func has_quest(id: String, yes: int, no: int) -> void:
    var state = self.app_root.state
    if state.has_quest(id):
        self.script_runner.set_pointer(yes)
    else:
        self.script_runner.set_pointer(no)

func has_completed_quest(id: String, yes: int, no: int) -> void:
    var state = self.app_root.state
    if state.has_completed_quest(id):
        self.script_runner.set_pointer(yes)
    else:
        self.script_runner.set_pointer(no)

func update_quest(id: String, status: Quest.Status) -> void:
    var state = self.app_root.state
    state.update_quest(id, status)

func add_quest_item(id: String, desc: String) -> void:
    var state = self.app_root.state
    state.add_quest_item(id, desc)

func has_quest_item(id: String, yes: int, no: int) -> void:
    var state = self.app_root.state
    if state.has_quest_item(id):
        self.script_runner.set_pointer(yes)
    else:
        self.script_runner.set_pointer(no)

func has_quest_item_count(id: String, count: int, yes: int, no: int) -> void:
    var state = self.app_root.state
    if state.has_quest_item_count(id, count):
        self.script_runner.set_pointer(yes)
    else:
        self.script_runner.set_pointer(no)

func update_quest_item(id: String, count: int) -> void:
    var state = self.app_root.state
    state.update_quest_item(id, count)

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

func if_confirm(yes: int, no: int) -> void:
    if self.script_runner.current_cond:
        self.script_runner.set_pointer(yes)
    else:
        self.script_runner.set_pointer(no)

func exit_script() -> void:
    self.script_runner.set_pointer(-1)

# Debug
func _on_button_8_pressed() -> void:
    self.load_map("taldo")

func _on_button_7_pressed() -> void:
    self.load_map("test_map")
