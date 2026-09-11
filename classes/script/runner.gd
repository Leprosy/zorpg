class_name Runner

var script_data: Array
var game: Screen
var run_next: bool
var pointer: int
var current_cond: bool

static var inmediate = [ # TODO: Maybe inmediate is the default?
    "hide_npc_dialog", 
    "hide_wide_dialog",
    "hide_confirm_dialog", 
    "if_confirm",
    "exit_script",
    "has_quest",
    "has_completed_quest",
    "add_quest",
    "update_quest"
]

func _init(new_script_data: Array, new_game: Screen) -> void:
    self.script_data = new_script_data
    self.game = new_game
    self.pointer = 0
    self.run_next = false
    self.current_cond = false

func run() -> void:
    if self.pointer >= self.script_data.size() or self.pointer < 0:
        print("Script finished")
        self.game.is_scripting = false
        self.run_next = false
        self.pointer = 0
        return

    var line = self.script_data[self.pointer]
    print("Executing line: ", self.pointer)
    print(line)
    self.pointer += 1
    if self.game.has_method(line.cmd):
        if line.has("args"):
            self._call_with_args(line.cmd, line.args)
        else:
            self.game[line.cmd].call()
        if Runner.inmediate.has(line.cmd):
            self.run_next = true
    else:
        print("Unknown command: ", line.cmd)
    print("command executed")
    if self.run_next:
        print("auto running next line")
        self.run_next = false
        self.run()

func set_cond(val: bool) -> void:
    self.current_cond = val

func set_pointer(val: int) -> void:
    self.pointer = val

func _call_with_args(cmd: StringName, args: Dictionary) -> void:
    for method_info in self.game.get_method_list():
        if method_info.name != cmd:
            continue
        var ordered_args: Array = []
        for arg_info in method_info.args:
            if not args.has(arg_info.name):
                print("Missing argument '%s' for '%s'" % [arg_info.name, cmd])
                return
            ordered_args.append(args[arg_info.name])
        self.game.callv(cmd, ordered_args)
        return
    print("Unknown command: %s" % cmd)
