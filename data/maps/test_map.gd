extends GameMap

func _ready() -> void:
    super()
    print("loading data")

    self.script_data = {
        "3x-4": [
            { "cmd": "show_npc_dialog", "args": { "npc": 1, "title": "John Doe", "content": "This is me speaking!" } },
            { "cmd": "show_npc_dialog", "args": { "npc": 1, "title": "John Doe", "content": "Do you confirm?" } },
            { "cmd": "show_confirm_dialog" },
            { "cmd": "hide_npc_dialog" },
            { "cmd": "hide_confirm_dialog" },
            { "cmd": "if_confirm", "args": { "yes": 9, "no": 6 } },
            { "cmd": "show_wide_dialog", "args": { "content": "This is cancelled..." } },
            { "cmd": "hide_wide_dialog" },
            { "cmd": "exit_script" },
            { "cmd": "show_wide_dialog", "args": { "content": "This is confirmed!" } },
            { "cmd": "hide_wide_dialog" },
        ]
    }
