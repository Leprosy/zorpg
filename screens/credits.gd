extends Screen

func _ready() -> void:
    print("Credits")
    print(self.app_root)


func _on_button_pressed() -> void:
    self.app_root.change_screen(Root.ScreenName.MAIN_MENU)
