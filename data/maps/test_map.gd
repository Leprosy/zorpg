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
            { "cmd": "add_quest", "args": { "id": "taldo1", "desc": "Find Super Taldo" } },
            { "cmd": "hide_wide_dialog" },
        ],
        "3x-3": [
            { "cmd": "has_quest", "args": { "id": "taldo1", "yes": 4, "no": 1 } },
            { "cmd": "show_npc_dialog", "args": { "npc": 5, "title": "Super Taldo", "content": "I dont know you..." } },
            { "cmd": "hide_npc_dialog" },
            { "cmd": "exit_script" },
            { "cmd": "has_completed_quest", "args": { "id": "taldo1", "yes": 10, "no": 5 } } ,
            { "cmd": "update_quest", "args": { "id": "taldo1", "status": Quest.Status.Completed}},
            { "cmd": "show_npc_dialog", "args": { "npc": 5, "title": "Super Taldo", "content": "Hello friends! I was expecting you..." } },
            { "cmd": "show_npc_dialog", "args": { "npc": 5, "title": "Super Taldo", "content": "¡OAW!" } },
            { "cmd": "hide_npc_dialog" },
            { "cmd": "exit_script" },
            { "cmd": "show_npc_dialog", "args": { "npc": 5, "title": "Super Taldo", "content": "Always a pleasure seeing you, friends!" } },
            { "cmd": "show_npc_dialog", "args": { "npc": 5, "title": "Super Taldo", "content": "¡OAW!" } },
            { "cmd": "hide_npc_dialog" },
        ]
    }
