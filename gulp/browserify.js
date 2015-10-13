'use strict';

var source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),

    // Browserify-related
    browserify = require('browserify'),
    watchify = require('watchify'),
    reactify = require('reactify'),

    // Gulp plugins
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),

    // Utility
    assign = require('lodash').assign

module.exports = function (gulp, server) {
    var bundler = browserify(assign({}, watchify.args, {
            entries: ['./src/js/app/helloworld.jsx'],
            transform: [reactify],
            debug: true
        })),
        watcher = watchify(bundler)

    gulp.task('browserify:development', bundle)

    watcher.on('update', bundle)
    watcher.on('log', gutil.log)

    function bundle() {
        var b = watcher.bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source('helloworld.jsx'))
            .pipe(buffer())
            // optional, remove if you dont want sourcemaps
            // .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
               // Add transformation tasks to the pipeline here.
            .pipe(uglify({
                compress: false
            }))
            // .pipe(sourcemaps.write('./')) // writes .map file
            .pipe(rename('helloworld.js'))
            .pipe(gulp.dest('./build'))

        if (server) {
            b.pipe(server.reload())
        }
    }
}
