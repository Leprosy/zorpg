class_name Runner

var script_data: Array
var game: Screen
var is_executing: bool
var waiting_for_input: bool
var pointer: int

func _init(new_script_data: Array, new_game: Screen) -> void:
    self.script_data = new_script_data
    self.game = new_game
    self.pointer = 0

func run() -> void:        
    var line = self.script_data[self.pointer]
    print("Executing line: ", self.pointer)
    print(line)
    if self.has_method(line.cmd):
        if line.has("args"):
            self[line.cmd].call(line.args)
        else:
            self[line.cmd].call()
        self.waiting_for_input = true
    else:
        print("Unknown command: ", line.cmd)
    self.pointer += 1
    if self.pointer >= self.script_data.size():
        print("Script finished")
        self.game.is_scripting = false
        self.pointer = 0

func show_npc_dialog(data: Dictionary) -> void:
    self.game.show_npc_dialog(data.title, data.content, data.npc.to_int())

func hide_npc_dialog() -> void:
    self.game.hide_npc_dialog()

func show_wide_dialog(data: Dictionary) -> void:
    self.game.show_wide_dialog(data.content)

func hide_wide_dialog() -> void:
    self.game.hide_wide_dialog()
