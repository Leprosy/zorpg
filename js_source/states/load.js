// Loading state...preloader and resource management
ZORPG.State.add("load", {
    init: function() {
        console.log("ZORPG.State.load: Loading...");
        ZORPG.Canvas.init();

        ZORPG.Loader.addTextFileTask("map", "maps/map1.json");
        ZORPG.Loader.addImageTask("splash", "img/splash.png");
        ZORPG.Loader.addImageTask("npc", "img/npc.png");
        ZORPG.Loader.onTasksDoneObservable.add(function() {
            //ZORPG.State.set("main_menu");
            ZORPG.State.set("play");
        });
        ZORPG.Loader.load();

    },
    destroy: function() {
        console.log("ZORPG.State.load: Loading finished.");
    }
});