'use strict';

var gulp = require('gulp');

gulp.task('watch', ['wiredep', 'scripts', 'styles', 'images'] ,function () {
  gulp.watch(['app/**/*.scss', '!app/bower_components/**/*'], ['styles']);
  gulp.watch(['app/scripts/**/*.[jt]s', '!app/bower_components/**/*'], ['scripts']);
  gulp.watch('app/components/lib/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
