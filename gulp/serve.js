var connect = require('gulp-connect')

module.exports = function(gulp) {
    gulp.task('serve:development', function () {
        connect.server({
            root: './build',
            livereload: true,
            port: 4242
        })
    })

    return connect
}
