shader_type spatial;
render_mode cull_disabled;

uniform sampler2D tileset_texture : source_color, filter_nearest;

// 1. Grid Configuration
uniform int columns = 4;
uniform int rows = 1;

// 2. Animation Configuration
uniform float frames_per_second = 3.0;
uniform int total_frames = 20; // Total valid frames (useful if sheet isn't a perfect square)

void vertex() {
	// Forces the quad to face the camera on all axes (Y-billboard)
	MODELVIEW_MATRIX = VIEW_MATRIX * mat4(
		vec4(normalize(INV_VIEW_MATRIX[0].xyz), 0.0),
		vec4(normalize(INV_VIEW_MATRIX[1].xyz), 0.0),
		vec4(normalize(INV_VIEW_MATRIX[2].xyz), 0.0),
		MODEL_MATRIX[3]
	);
	MODELVIEW_NORMAL_MATRIX = mat3(MODELVIEW_MATRIX);
}

void fragment() {
    // Determine the current frame index as an integer step over time
    int current_frame = int(floor(TIME * frames_per_second)) % total_frames;
    
    // Find the row and column coordinate index for this frame
    int frame_col = current_frame % columns;
    int frame_row = current_frame / columns;
    
    // Size of an individual tile relative to the whole sheet (range 0.0 to 1.0)
    vec2 tile_size = vec2(1.0 / float(columns), 1.0 / float(rows));
    
    // Step A: Shrink the UV so it matches a single tile's proportions
    vec2 single_tile_uv = UV * tile_size;
    
    // Step B: Calculate the top-left coordinate offset of our active cell
    vec2 tile_offset = vec2(float(frame_col), float(frame_row)) * tile_size;
    
    // Combine scaled UVs with the snapped grid position
    vec2 final_uv = single_tile_uv + tile_offset;
    
    // Sample texture
    vec4 tex_color = texture(tileset_texture, final_uv);
    ALBEDO = tex_color.rgb;
    ALPHA = tex_color.a;
}