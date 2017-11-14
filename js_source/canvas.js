var ZORPG = ZORPG || {};

/**
 *  Canvas module...anything screen related goes here
 *  
 */


ZORPG.Canvas = (function() {
    return {
        tileSize: 50,
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
            this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);
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
            console.log("Rendering", map)

            for (y = 0; y < map.floor.length; ++y) {
                for (x = 0; x < map.floor[y].length; ++x) {
                    var mesh = BABYLON.Mesh.CreateBox("floor" + x + "-" + y, tileSize, ZORPG.Canvas.scene);
                    //var mesh = BABYLON.Mesh.CreateBox(txt + item.x + "x" + item.y, size, Game.scene);
                    mesh.position.x = x * Game.size;
                    mesh.position.z = y * Game.size;
                    mesh.position.y = 0;
                }
            }
        }
        /*load: function(obj) {
            if typeof()
        } */
    }
})();

