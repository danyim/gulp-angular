'use strict';

var gulp = require('gulp');

gulp.task('watch', ['wiredep', 'styles', 'images'] ,function () {
  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('app/components/lib/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
