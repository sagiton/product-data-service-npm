var history = require('connect-history-api-fallback');
var modRewrite = require('connect-modrewrite');
var pdsPaths = ['pds.html', '/src/test/project/buderus/ocs.html'];
var pdsHtml = pdsPaths[1];

module.exports = {
    open: false,
    watchEvents: [],
    files: [
        "./dist/**/*.{css,js}",
        "./js/html/**/*.html"
    ],
    server: {
        baseDir: "./",
        routes: {
            "/node_modules": "node_modules"
        },
        middleware: [
            modRewrite(['^/[a-z]{0,2}/[a-z]{0,2}/(.*)$ http://localhost:3000/$1 [P]']),
            history({index: '/' + pdsHtml})
        ]
    }
};
