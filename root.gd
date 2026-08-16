class_name Root
extends Node

# Scene register
enum ScreenName { MAIN_MENU, CREDITS, HELP, GAME }
var state = State.new()
var scenes = {
    ScreenName.CREDITS: preload("res://screens/credits.tscn"),
    ScreenName.MAIN_MENU: preload("res://screens/main_menu.tscn"),
    ScreenName.GAME: preload("res://screens/game.tscn")
}

func _ready() -> void:
    TranslationServer.set_locale("es")
    print("ok")
    print(tr("GREET"))
    self.change_screen(ScreenName.MAIN_MENU)

func change_screen(screen: ScreenName) -> void:
    for n in $CurrentScreen.get_children():
        $CurrentScreen.remove_child(n)
        n.queue_free()

    var scene = scenes[screen].instantiate() as Screen
    scene.app_root = self
    $CurrentScreen.add_child(scene)
