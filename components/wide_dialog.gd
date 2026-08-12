extends Node

func show(content: String) -> void:
    self.visible = true
    $Content.text = content

func hide() -> void:
    self.visible = false
