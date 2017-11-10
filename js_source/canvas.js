var ZORPG = ZORPG || {};

/**
 *  Canvas module...anything screen related goes here
 *  
 */


ZORPG.Canvas = (function() {
    return {
        engine: null,
        scene: null,
        camera: null,
        GUI: null,

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

            // Setup content
            var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, this.scene);
            sphere.position.y = 1;
            //var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

            // GUI
            this.GUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

            // Rendering loop
            this.engine.runRenderLoop(function () {
                ZORPG.Canvas.scene.render();
            });
        },

        /*load: function(obj) {
            if typeof()
        } */
    }
})();

