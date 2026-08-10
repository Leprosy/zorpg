extends GameMap

func _ready() -> void:
    super()
    print("loading data")

    self.script_data = {
        "3x-4": "this is data"
    }
