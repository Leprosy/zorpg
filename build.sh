# Dist build
#node_modules/uglify-js/bin/uglifyjs js_source/boot.js js_source/states/* js_source/start.js js_source/lib/* -o js/game.js
# Dev build
node_modules/uglify-js/bin/uglifyjs js_source/*.js js_source/states/*.js js_source/components/*.js --comments all -b -o js/game.js
# node_modules/uglify-js/bin/uglifyjs js_source/boot.js js_source/start.js js_source/lib/* --comments all -b -o js/game.js
#tsc -project ./ts_source/ -out ./js/game.js
