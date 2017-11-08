var history = require('connect-history-api-fallback');
var modRewrite = require('connect-modrewrite');
var argv = require('yargs').argv;

var defaultLang = 'gb/en'
var pdsPathsDefault = 'pds.html';
var pdsPaths = {
    buderus: '/src/test/project/buderus/ocs.html',
    boschtt: '/src/test/project/boschtt/ocs.html'
};
var pdsHtml = pdsPaths[process.env.npm_config_consumer || argv.consumer] || pdsPathsDefault;
console.log('Using OCS base: ' + pdsHtml);

module.exports = {
    open: true,
    startPath: "/" + defaultLang + "/ocs",
    watchEvents: [],
    files: [
        "./dist/**/*.{css,js}",
        "./js/html/**/*.html"
    ],
    server: {
        baseDir: "./",
        routes: {
            "/node_modules": "node_modules",
            "/media/images": "src/media"
        },
        middleware: [
            modRewrite(['^/[a-z]{0,2}/[a-z]{0,2}/(.*)$ http://localhost:3000/$1 [P]']),
            history({index: '/' + pdsHtml})
        ]
    }
};
