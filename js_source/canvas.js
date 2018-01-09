var ZORPG = ZORPG || {};

/**
 *  Canvas module...anything screen related goes here
 *  
 */


ZORPG.Canvas = (function() {
    return {
        isUpdating: false,
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

            // Skybox
            //this.skyBox = this.scene.createDefaultSkybox(new BABYLON.Texture("img/sky1.png", this.scene), true, 10);

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
        renderMap: function() {
            var map = ZORPG.Map.getData();
            console.log("ZORPG.Canvas: Rendering map", map)

            // Mats
            var materials = [];

            for (var i = 0; i < 10; ++i) {
                var mat = new BABYLON.StandardMaterial("txt" + i, this.scene);
                mat.diffuseColor = new BABYLON.Color3(i / 10, i / 10, i / 10);
                materials.push(mat);
            }
            var monsterMaterial = new BABYLON.StandardMaterial("txtmon", this.scene);
            monsterMaterial.diffuseColor = new BABYLON.Color3(100, 0, 0);
            var objMaterial = new BABYLON.StandardMaterial("txtobj", this.scene);
            objMaterial.diffuseColor = new BABYLON.Color3(0, 0, 20);

            // Floors & Objects
            for (var y = 0; y < map.floor.length; ++y) {
                for (var x = 0; x < map.floor[y].length; ++x) {
                    var meshf = BABYLON.Mesh.CreateBox("floor" + x + "-" + y, this.tileSize, this.scene);
                    meshf.position.x = x * this.tileSize;
                    meshf.position.z = y * this.tileSize;
                    meshf.position.y = 0;
                    meshf.scaling.y = 0.1;
                    meshf.material = materials[map.floor[y][x]];

                    if (map.object[y][x] != 0) {
                        var mesho = BABYLON.Mesh.CreateBox("object" + x + "-" + y, this.tileSize / 2, this.scene);
                        mesho.position.x = x * this.tileSize;
                        mesho.position.z = y * this.tileSize;
                        mesho.position.y = this.tileSize / 4;
                        mesho.material = objMaterial;
                    }
                }
            }

            // Monsters
            for (var i = 0; i < ZORPG.Monsters.length; ++i) {
                var monster = ZORPG.Monsters[i];
                console.log(monster)
                var mesh = BABYLON.MeshBuilder.CreateSphere("monster" + i, {diameter: this.tileSize * 0.4}, this.scene);
                //var mesh = BABYLON.Mesh.CreateBox("monster" + i, this.tileSize, this.scene);
                mesh.position.x = monster.pos.x * this.tileSize;
                mesh.position.z = monster.pos.y * this.tileSize;
                mesh.position.y = this.tileSize / 4;
                mesh.material = monsterMaterial;
            }

            // Put camera/player
            this.camera.position.x = map.properties.startX * this.tileSize;
            this.camera.position.z = map.properties.startY * this.tileSize;
            this.camera.position.y = this.tileSize / 4;
            this.camera.rotation.x = 0;
            this.camera.rotation.z = 0;
            this.camera.rotation.y = 0;
        },

        // Updates canvas objects; positions, etc.
        update: function(player) {
            var _this = this;
            var turnSpent = player.ang === this.camera.rotation.y;
            this.isUpdating = true;

            // Useful while debugging: reset camera rotation & y-axis position
            this.camera.rotation.x = 0;
            this.camera.rotation.z = 0;
            this.camera.position.y = this.tileSize / 4;

            // Set animation and run
            var aniRot = new BABYLON.Animation("rotate", "rotation.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
            var aniX = new BABYLON.Animation("move", "position.x", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
            var aniZ = new BABYLON.Animation("move", "position.z", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
            aniX.setKeys([{frame: 0, value: this.camera.position.x}, {frame: 15, value: player.x * this.tileSize}]);
            aniZ.setKeys([{frame: 0, value: this.camera.position.z}, {frame: 15, value: player.y * this.tileSize}]);
            aniRot.setKeys([{frame: 0, value: this.camera.rotation.y}, {frame: 15, value: player.ang}]);
            this.camera.animations.push(aniX);
            this.camera.animations.push(aniZ);
            this.camera.animations.push(aniRot);
            this.scene.beginAnimation(this.camera, 0, 30, false, 1 , function() {
                _this.isUpdating = false; //EVENTPLZ <- ????
                _this.camera.animations = [];
                // TODO: Check if a turn was spent
                if (turnSpent) {
                    console.log("ZORPG.Canvas: Turn spent")
                }
            });

            // Old update code - maybe an oldschool movement mode? XD
            /*this.camera.position.x = player.x * this.tileSize;
            this.camera.position.z = player.y * this.tileSize;
            this.camera.position.y = this.tileSize / 4;
            this.camera.rotation.x = 0;
            this.camera.rotation.z = 0;
            this.camera.rotation.y = player.ang;*/
        }
    }
})();

