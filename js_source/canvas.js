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
        speed: 10,

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
            this.camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, this.tileSize * 0.8, new BABYLON.Vector3(0, 0, 0), this.scene)
            this.camera.attachControl(canvas, true);

            // Light
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
            light.intensity = 0.5;

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
                        var mesho = BABYLON.Mesh.CreateBox("object" + x + "-" + y, this.tileSize / 3, this.scene);
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
                var mesh = BABYLON.MeshBuilder.CreateSphere("monster" + i, {diameter: this.tileSize * 0.4}, this.scene);
                mesh.position.x = monster.pos.x * this.tileSize;
                mesh.position.z = monster.pos.y * this.tileSize;
                mesh.position.y = this.tileSize / 4;
                mesh.material = monsterMaterial;
            }

            // Put camera/player
            this.camera.target.x = map.properties.startX * this.tileSize;
            this.camera.target.z = map.properties.startY * this.tileSize;
            this.camera.target.y = this.tileSize / 4;
            this.camera.beta = Math.PI / 2;
        },

        // Updates canvas objects; positions, etc.
        update: function(call) {
            // Party
            var player = ZORPG.Player.pos;
            var _this = this;
            var turnSpent = player.ang === this.camera.rotation.y; // TODO: IS THIS USEFUL?
            this.isUpdating = true;

            // Useful while debugging: reset camera rotation & y-axis position
            this.camera.beta = Math.PI / 2;
            this.camera.position.y = this.tileSize / 4;

            // Set animation and run
            var aniRot = new BABYLON.Animation("rotate", "alpha", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
            var aniX = new BABYLON.Animation("move", "target.x", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
            var aniZ = new BABYLON.Animation("move", "target.z", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
            aniX.setKeys([{frame: 0, value: this.camera.target.x}, {frame: this.speed / 2, value: player.x * this.tileSize}]);
            aniZ.setKeys([{frame: 0, value: this.camera.target.z}, {frame: this.speed / 2, value: player.y * this.tileSize}]);
            aniRot.setKeys([{frame: 0, value: this.camera.alpha}, {frame: this.speed / 2, value: -player.ang - Math.PI / 2}]); // Little correction
            this.camera.animations.push(aniX);
            this.camera.animations.push(aniZ);
            this.camera.animations.push(aniRot);
            this.scene.beginAnimation(this.camera, 0, this.speed, false, 1 , function() {
                _this.isUpdating = false; //EVENTPLZ <- ????
                _this.camera.animations = [];

                // Update rest of the world after player animation ends.
                // Monsters (TODO: animated translation)
                for (var i = 0; i < ZORPG.Monsters.length; ++i) {
                    var monster = ZORPG.Canvas.scene.getMeshByID("monster" + i);
                    monster.position.x = ZORPG.Monsters[i].pos.x * _this.tileSize;
                    monster.position.z = ZORPG.Monsters[i].pos.y * _this.tileSize;
                }

                // After everything is done, callback
                if (typeof call === "function") {
                    call();
                }
            });

            // Old update code - maybe an oldschool movement mode? XD
            /*this.camera.position.x = player.x * this.tileSize;
            this.camera.position.z = player.y * this.tileSize;
            this.camera.position.y = this.tileSize / 4;
            this.camera.rotation.x = 0;
            this.camera.rotation.z = 0;
            this.camera.rotation.y = player.ang;*/
        },

        // Update roster
        drawChars: function() {
            $("#roster").html("");

            for (var i = 0; i < ZORPG.Player.party.actors.length; ++i) {
                var char = ZORPG.Player.party.actors[i];

                var div = $("<div>");
                div.addClass("col-md-4");
                div.html("<b>" + char.actor.name + "</b><br />HP:" + char.actor.hp);
                $("#roster").append(div);
            }
        },

        // Shakes the camera
        shake: function(str, call) {
            var speed = 10;
            var str = str || 0.25;
            var steps = 6;
            var alpha = this.camera.alpha;
            var beta = this.camera.beta;
            var ani1 = new BABYLON.Animation("rotate", "alpha", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
            var ani2 = new BABYLON.Animation("rotate", "beta", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);

            var keys = [{frame: 0, value: alpha}];
            for (var i = 1; i < steps; ++i) {
                keys.push({frame: i * speed / steps, value: alpha + (Math.random() * str - str / 2)});
            }
            keys.push({frame: speed, value: alpha});
            ani1.setKeys(keys);
            keys = [{frame: 0, value: beta}];
            for (var i = 1; i < steps; ++i) {
                keys.push({frame: i * speed / steps, value: beta + (Math.random() * str - str / 2)});
            }
            keys.push({frame: speed, value: beta});
            ani2.setKeys(keys);

            this.camera.animations.push(ani1);
            this.camera.animations.push(ani2);
            this.scene.beginAnimation(this.camera, 0, speed, false, 1 , function() {
                console.log("end shake!")
            })
        }
    }
})();

