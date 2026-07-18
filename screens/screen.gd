class_name Screen

extends Node

var app_root: Root

func change_screen(screen_name: String) -> void:
    app_root.change_screen(screen_name)

# Optional lifecycle hooks
func on_enter() -> void:
    pass
func on_exit() -> void:
    pass
