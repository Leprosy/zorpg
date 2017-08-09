/**
 * Utils & Helpers
 */
Game.Log = function(str, opt) {
    $('#console').append("[" + new Date().toString().split(" ")[4] + "] " + str + "\n")
}