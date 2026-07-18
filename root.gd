class_name Root

extends Node

# Scene register
var scenes = {
    "credits": preload("res://screens/credits.tscn"),
}

func _ready() -> void:
    TranslationServer.set_locale("es")
    print("ok")
    print(tr("GREET"))
    self.change_screen("credits")

func change_screen(screen: String) -> void:
    for n in $CurrentScreen.get_children():
        $CurrentScreen.remove_child(n)
        n.queue_free()

    var scene = scenes[screen].instantiate() as Screen
    scene.app_root = self
    $CurrentScreen.add_child(scene)
