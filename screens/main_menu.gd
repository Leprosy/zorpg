extends Screen

func _ready() -> void:
    print("Main Menu")


func _on_new_game_pressed() -> void:    
    print("new game")
    self.app_root.change_screen(Root.ScreenName.GAME)

func _on_load_game_pressed() -> void:
    print("load game")


func _on_credits_pressed() -> void:
    print("credits")
    self.app_root.change_screen(Root.ScreenName.CREDITS)
