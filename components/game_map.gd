class_name GameMap
extends Node3D

enum NavigationLayers {
    DEFAULT = 1,
    IMPASSABLE = 2,
}

func _ready() -> void:
    print(self)
    print('GameMap ready')

func oaw() -> void:
    print("oaw")

func is_cell_passable(position: Vector3) -> bool:
    var grid = $LayoutGridMap
    var local_pos = grid.to_local(position)
    var map_pos = grid.local_to_map(local_pos)
    var cell_id = grid.get_cell_item(map_pos)
    if cell_id == -1:
        return false
    var mesh = grid.mesh_library.get_item_navigation_layers(cell_id)
    return mesh == NavigationLayers.DEFAULT
