extends GameMap

func _ready() -> void:
    super()
    print("loading data")

    self.script_data = {
        "3x-4": [
            { "cmd": "show_npc_dialog", "args": { "npc": "1", "title": "John Doe", "content": "This is me speaking!" } },
            { "cmd": "hide_npc_dialog" },
            { "cmd": "show_wide_dialog", "args": { "content": "This is done!" } },
            { "cmd": "hide_wide_dialog"},
            { "cmd": "fuck_you", "args": { "x": 3, "y": 4, "z": 5 } },
        ]
    }
