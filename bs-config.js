module.exports = {
    files: [
        "./dist/**/*.{css,js}"
    ],
    server: {
        baseDir: "./",
        routes: {
            "/node_modules": "node_modules"
        }
    }
};
