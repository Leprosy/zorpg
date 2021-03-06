// TODO: Refactor the dialog code into something that one can look at...
ZORPG.State.add("message", {
    name: "message",

    init: function() {
        this[this.scope.mode]();
    },

    show: function() {
        var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Ok");
        button1.width = "150px"
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";

        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = this.scope.msg;
        text1.color = "white";
        text1.top = -100;
        text1.fontSize = 24;

        button1.onPointerUpObservable.add(function() {
            ZORPG.Canvas.GUI.removeControl(text1);
            ZORPG.Canvas.GUI.removeControl(button1);
            ZORPG.State.set("script");
        });

        ZORPG.Canvas.GUI.addControl(text1);
        ZORPG.Canvas.GUI.addControl(button1);
    },

    showDialog: function() {
        var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Ok");
        button1.width = "150px"
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";

        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = this.scope.name + " says:\n" + this.scope.msg;
        text1.color = "white";
        text1.top = -100;
        text1.fontSize = 24;

        button1.onPointerUpObservable.add(function() {
            ZORPG.Canvas.GUI.removeControl(text1);
            ZORPG.Canvas.GUI.removeControl(button1);
            ZORPG.State.set("script");
        });

        ZORPG.Canvas.GUI.addControl(text1);
        ZORPG.Canvas.GUI.addControl(button1);
    },

    showConfirm: function() {
        var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Yes");
        var button2 = BABYLON.GUI.Button.CreateSimpleButton("but2", "No");
        button1.width = "150px"
        button1.height = "40px";
        button1.left = "-100px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        button2.width = "150px"
        button2.height = "40px";
        button2.left = "100px"
        button2.color = "white";
        button2.cornerRadius = 20;
        button2.background = "green";

        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = this.scope.name + " says:\n" + this.scope.msg;
        text1.color = "white";
        text1.top = -100;
        text1.fontSize = 24;

        button1.onPointerUpObservable.add(function() {
            ZORPG.Canvas.GUI.removeControl(text1);
            ZORPG.Canvas.GUI.removeControl(button1);
            ZORPG.Canvas.GUI.removeControl(button2);
            ZORPG.Script.setConfirm(true);
            ZORPG.State.set("script");
        });
        button2.onPointerUpObservable.add(function() {
            ZORPG.Canvas.GUI.removeControl(text1);
            ZORPG.Canvas.GUI.removeControl(button1);
            ZORPG.Canvas.GUI.removeControl(button2);
            ZORPG.Script.setConfirm(false);
            ZORPG.State.set("script");
        });

        ZORPG.Canvas.GUI.addControl(text1);
        ZORPG.Canvas.GUI.addControl(button1);
        ZORPG.Canvas.GUI.addControl(button2);
    }
})