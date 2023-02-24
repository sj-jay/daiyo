"use strict";
const { series, watch } = require("gulp");
const browserSync = require("browser-sync").create();



const PATHS = {
    dist: "./dist",
    index: {
        dest: "./dist/index.html"
    },
    styles: {
        dest: "./dist/css/*.css"
    },
    scripts: {
        dest: "./dist/js/*.js"
    }
};

// methods
function errorHandler(err, stats) {
    if (err || (stats && stats.compilation.errors.length > 0)) {
        const error = err || stats.compilation.errors[0].error;
        notify.onError({ message: "<%= error.message %>" })(error);
        this.emit("end");
    }
}




// server
const browserSyncOption = {
    open: false,
    port: 3000,
    ui: {
        port: 3001
    },
    server: {
        baseDir: PATHS.dist, // output directory,
        index: "index.html"
    }
};

function browsersync(done) {
    browserSync.init(browserSyncOption);
    done();
}

// browser reload
function browserReload(done) {
    browserSync.reload();
    done();
    console.info("Browser reload completed");
}

// watch
function watchFiles(done) {
    watch(PATHS.index.dest, browserReload);
    watch(PATHS.styles.dest, browserReload);
    watch(PATHS.scripts.dest, browserReload);
    done();
}

// commands
exports.default = series(browsersync, watchFiles);
