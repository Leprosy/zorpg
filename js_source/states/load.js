// Loading state...preloader and resource management
ZORPG.State.add("load", {
    name: "Loading...",
    init: function() {
        ZORPG.Canvas.init();

        ZORPG.Loader.addTextFileTask("map", "maps/map1.json");
        ZORPG.Loader.addImageTask("splash", "img/splash.png");
        ZORPG.Loader.addImageTask("npc", "img/npc.png");
        ZORPG.Loader.onTasksDoneObservable.add(function() {
            ZORPG.State.set("main_menu");
        });
        ZORPG.Loader.load();

    },
    destroy: function() {}
});