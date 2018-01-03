var ZORPG = ZORPG || {};

/**
 *  Canvas module...anything screen related goes here
 *  
 */


ZORPG.Canvas = (function() {
    return {
        tileSize: 10,
        engine: null,
        scene: null,
        camera: null,
        GUI: null,

        // Init everything
        init: function() {
            var canvas = document.getElementById("3d");
            this.engine = new BABYLON.Engine(canvas, true);
            this.scene = new BABYLON.Scene(this.engine);

            // Assets loader(is this hacky? call 1-800-IM-B31N6-H4CKY)
            ZORPG.Loader = new BABYLON.AssetsManager(this.scene);
            ZORPG.Loader.onTaskSuccessObservable.add(function(task, event) {
                console.log("ZORPG.Loader: Task succesful", task)
            });
            ZORPG.Loader.onTasksDoneObservable.add(function(a, b ,c) {});
            ZORPG.Loader.onProgressObservable.add(function(progress, event) {
                console.log("ZORPG.Loader: Progress", progress)
                ZORPG.Canvas.engine.loadingUIText = "Loading " + progress.remainingCount + "/" + progress.totalCount;
            });

            // Camera
            this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), this.scene);
            this.camera.setTarget(BABYLON.Vector3.Zero());
            this.camera.attachControl(canvas, true);

            // Light
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
            light.intensity = 0.7;

            // GUI
            this.GUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

            // Rendering loop
            this.engine.runRenderLoop(function () {
                ZORPG.Canvas.scene.render();
            });
        },

        // Clear the 3d canvas
        clear: function() {
            while (this.scene.meshes.length > 0) {
                this.scene.meshes[0].dispose();
            }
        },

        // Render a map
        renderMap: function(map) {
            console.log("ZORPG.Canvas: Rendering map", map)

            // Mats
            var materials = [];

            for (i = 0; i < 10; ++i) {
                var mat = new BABYLON.StandardMaterial("txt" + i, this.scene);
                mat.diffuseColor = new BABYLON.Color3(i / 10, i / 10, i / 10);
                materials.push(mat);
            }

            // Floors
            for (y = 0; y < map.floor.length; ++y) {
                for (x = 0; x < map.floor[y].length; ++x) {
                    var mesh = BABYLON.Mesh.CreateBox("floor" + x + "-" + y, this.tileSize, ZORPG.Canvas.scene);

                    mesh.position.x = x * this.tileSize;
                    mesh.position.z = y * this.tileSize;
                    mesh.position.y = 0;
                    mesh.scaling.y = 0.1;
                    mesh.material = materials[map.floor[y][x]];
                }
            }

            // Put camera/player
            this.camera.position.x = map.properties.startX * this.tileSize;
            this.camera.position.z = map.properties.startY * this.tileSize;
            this.camera.position.y = this.tileSize / 4;
            this.camera.rotation.x = 0;
            this.camera.rotation.z = 0;
            this.camera.rotation.y = 0;
        },

        // Updates camera to reflect player position
        updateCamera: function(player) {
            this.camera.position.x = player.x * this.tileSize;
            this.camera.position.z = player.y * this.tileSize;
            this.camera.position.y = this.tileSize / 4;
            this.camera.rotation.x = 0;
            this.camera.rotation.z = 0;
            this.camera.rotation.y = player.ang;
        },

        // Movement
        /*forward: function() { _move(1); },
        backward: function() { _move(-1); },
        _move: function(d) {

            var x = this.camera.position.x;
            var z = this.camera.position.z;
            var vert = Math.round(Math.cos(this.camera.rotation.y));
            var horz = Math.round(Math.sin(this.camera.rotation.y));
            var newx = x + d * horz * this.tileSize;
            var newz = z + d * vert * this.tileSize;

                var newPx = this.camera.x + d * horz;
                var newPy = this.camera.y + d * vert;

                if (Game.checkCollision(newPx, newPy)) {;
                    return;
                } else {
                    Game.isMoving = true;
                    Game.player.x = newPx;
                    Game.player.y = newPy;
                    Game.map2dPoint.x = newPx * Game.map2dSize;
                    Game.map2dPoint.y = newPy * Game.map2dSize;

                    //Animation
                    var anix = new BABYLON.Animation("move", "position.x", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
                    var aniz = new BABYLON.Animation("move", "position.z", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
                    var keyx = [{frame: 0, value: Game.camera.position.x}, {frame: 15, value: newx}];
                    var keyz = [{frame: 0, value: Game.camera.position.z}, {frame: 15, value: newz}];
                    anix.setKeys(keyx);
                    aniz.setKeys(keyz);
                    Game.camera.animations.push(anix);
                    Game.camera.animations.push(aniz);
                    Game.scene.beginAnimation(Game.camera, 0, 30, false, 1, function() {
                        Game.isMoving = false; //EVENTPLZ
                        Game.camera.animations = [];

                        // A turn was spent
                        //Game.tick();
                    });
                }
        }, */

        // Rotations
        /*Game.rotateRight = function() { Game._rotate(1); };
        Game.rotateLeft = function() { Game._rotate(-1); };
        Game._rotate = function(d) {
            if (!Game.isMoving) {
                Game.isMoving = true;
                var y = Game.camera.rotation.y + d * (Math.PI / 2);

                //Game.camera.rotation.y = y + d * (Math.PI / 2);
                //Game.isMoving = false;
                //Animation
                var ani = new BABYLON.Animation("rotate", "rotation.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
                var key = [{frame: 0, value: Game.camera.rotation.y}, {frame: 15, value: y}];
                ani.setKeys(key);
                Game.camera.animations.push(ani);
                Game.scene.beginAnimation(Game.camera, 0, 30, false, 1 , function() {
                    Game.isMoving = false; //EVENTPLZ
                    Game.camera.animations = [];

                    // A turn was spent
                    Game.tick();
                });
            }
        }*/
    }
})();

