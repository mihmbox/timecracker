var gulp = require('gulp');
var spsave = require('gulp-spsave');
var watch = require('gulp-watch');
var filter = require('gulp-filter');
var webpack = require('webpack-stream');

var settings = {
    username: "user",
    password: 'password',
    siteUrl: 'https://firstdevelopmenthub-87fb5b989d9858.sharepoint.com/sites/mik/Trucker'
};

var uploadFiles = spsave({
    username: settings.username,
    password: settings.password,
    siteUrl: settings.siteUrl,
    folder: "Scripts/build",
    flatten: false,
    checkin: true,
    checkinType: 2  // 1 majorCheckIn; 0 minorCheckIn; 2 overwriteCheckIn
});

var assetsPath = [
    './Scripts/build/**/*.*',
];
// Ignore empty files, SharePoint doesn't allow to upload them
function ignoreEmptyFiles() {
    return filter(function (a) { return a.stat && a.stat.size; });
}
// Errors handler
function swallowError(error) {
    console.log(error.toString());
    this.emit('end');
}

// ============ TASKS =============================
gulp.task("spsave:copy-scripts", ["webpack:build"], function () {
    return gulp.src(assetsPath)
        .pipe(ignoreEmptyFiles())
        .pipe(uploadFiles);        
});

gulp.task('webpack:build', function() {
    return webpack(require('./webpack.config.js') )
      .pipe(gulp.dest('Scripts/build'));
      // .pipe(uploadFiles);
});

gulp.task('watch', function () {
    //gulp.watch(["www/**/*.jsx"], ["webpack:build"]);
    gulp.watch(["www/**/*.jsx"], ["spsave:copy-scripts"]);
});

// gulp.task("watch", function () {
//     return gulp.src(assetsPath)
//         .pipe(watch(assetsPath))
//         .pipe(ignoreEmptyFiles())
//         .pipe(uploadFiles)
//         .on('error', swallowError);
// });
// gulp.task("watch-old", function () {
//     return gulp.src(assetsPath)
//         .pipe(watch(assetsPath))
//         .pipe(ignoreEmptyFiles())
//         .pipe(uploadFiles)
//         .on('error', swallowError);
// });
