extends Node

const NPC_SIZE = 32
const NPC_ANIM = 'npc'
const NPC_SPEED = 5

func oaw():
    print("oaw")

func show(title: String, content: String, npc: int) -> void:
    self.visible = true
    $Title.text = title
    $Content.text = content

    var portrait = $NpcPortrait/AnimatedSprite2D
    var frames = SpriteFrames.new()
    portrait.frames = frames
    frames.add_animation(NPC_ANIM)
    frames.set_animation_loop(NPC_ANIM, true)
    frames.set_animation_speed(NPC_ANIM, NPC_SPEED)
    var texture: CompressedTexture2D = load("res://assets/img/npc/npc2.png")
    var full_image = texture.get_image()

    for y in range(0, 3):
        var region = Rect2(npc * NPC_SIZE, y * NPC_SIZE, NPC_SIZE, NPC_SIZE)
        var frame_image = Image.create(NPC_SIZE, NPC_SIZE, false, full_image.get_format())
        frame_image.blit_rect(full_image, region, Vector2(0, 0))
        var frame_texture = ImageTexture.create_from_image(frame_image)
        frames.add_frame(NPC_ANIM, frame_texture)
    
    portrait.animation = NPC_ANIM
    portrait.play()

func hide() -> void:
    self.visible = false
