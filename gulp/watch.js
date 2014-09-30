'use strict';

var gulp = require('gulp');

gulp.task('watch', ['wiredep', 'scripts', 'styles', 'vendor-styles', 'images'] ,function () {
  gulp.watch(['app/**/*.scss', '!app/bower_components/**/*'], ['styles']);
  gulp.watch(['app/**/*.[jt]s', '!app/bower_components/**/*'], ['scripts']);
  gulp.watch('app/components/lib/images/**/*', ['images']);
  gulp.watch(['app/**/*.html', '!app/bower_components/**/*', '!app/{index,404}.html'], ['partials']);
  gulp.watch('bower.json', ['wiredep', 'vendor-styles']);
});
