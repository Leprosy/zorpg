extends GameMap

func _ready() -> void:
    super()
    print("loading data")
    self.script_data = {
        "2x2": "this is data"
    }
