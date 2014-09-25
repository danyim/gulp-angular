'use strict';

var gulp = require('gulp');

gulp.task('watch', ['wiredep', 'styles', 'images'] ,function () {
  gulp.watch(['app/**/*.scss', '!app/bower_components/**/*'], ['styles']);
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('app/components/lib/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
