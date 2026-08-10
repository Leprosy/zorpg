class_name GameMap
extends Node3D

enum NavigationLayers {
    DEFAULT = 1,
    IMPASSABLE = 2,
}

var script_data = {}

func _ready() -> void:
    print('GameMap %s ready' % self)

func trans_pos(pos: Vector3, grid: GridMap) -> Vector3i:
    var local_pos: Vector3 = grid.to_local(pos)
    var map_pos = grid.local_to_map(local_pos)
    return map_pos

func get_layers(grid: GridMap, id: int) -> int:
    if id == -1:
        return 0

    return grid.mesh_library.get_item_navigation_layers(id)

func is_cell_passable(pos: Vector3) -> bool:
    var cells: GridMap = $LayoutGridMap
    var things: GridMap = $ThingsGridMap
    var cell_id = cells.get_cell_item(self.trans_pos(pos, cells))
    var thing_id = things.get_cell_item(self.trans_pos(pos, things))
    var cell = self.get_layers(cells, cell_id)
    var thing = self.get_layers(things, thing_id)
    var passable = cell != NavigationLayers.IMPASSABLE and thing != NavigationLayers.IMPASSABLE
    return passable

func get_cell_script(pos: Vector3) -> void:
    var cells: GridMap = $LayoutGridMap
    var vals = self.trans_pos(pos, cells)
    var key = "%dx%d" % [vals[0], vals[2]]

    if self.script_data.has(key):
        print(self.script_data.get(key))
