'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license']
});

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

var paths = {
  partials:   ['app/**/*.html', '!app/bower_components/**/*', '!app/{index,404}.html'],
  scripts:    ['app/**/*.[jt]s', '!app/**/*_test.[jt]s', '!app/**/*.d.ts', '!app/bower_components/**/*', '!app/components/scripts/**/*'],
  images:     './app/components/lib/images/**/*',
  styles:     ['app/**/*.{c,sc}ss', '!app/bower_components/**/*', '!app/vendor.scss', '!app/components/scripts/**/*'],
  vendor: {
    styles:   'app/vendor.scss',
    scripts:  $.mainBowerFiles()
  }
};

gulp.task('vendor-styles', function () {
  return gulp.src(paths.vendor.styles)
    .pipe($.newer('.tmp/styles/vendor.css'))
    .pipe($.rubySass({style: 'expanded'}))
    .on('error', handleError)
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.size());
});

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe($.newer('.tmp/styles/app.css'))
    .pipe($.rubySass({style: 'expanded'}))
    .on('error', handleError)
    .pipe($.autoprefixer('last 1 version'))
    .pipe($.concat('app.css'))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.size());
});

gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
    // .pipe($.changed('.tmp/scripts'))
    .pipe(
      $.if(/[.]js/,
        $.jshint()
        .pipe($.jshint.reporter('jshint-stylish'))
      )
    ).on('error', handleError)
    // Perform a TSLint and parse as Typescript if it's a .ts file
    .pipe(
      $.if(/[.]ts/,
        $.tslint()
        .pipe($.tslint.report('verbose'))
        .pipe($.typescript())
      )
    ).on('error', handleError)
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe($.size());
});

gulp.task('partials', function () {
  return gulp.src(paths.partials)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.ngHtml2js({
      moduleName: 'gulp'
    }))
    .pipe(gulp.dest('.tmp/partials'))
    .pipe($.size());
});

gulp.task('html', ['styles', 'vendor-styles', 'scripts', 'partials', 'images'], function () {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src('app/*.html')
    .pipe($.inject(gulp.src('.tmp/partials/**/*.js'), {
      read: false,
      starttag: '<!-- inject:partials -->',
      addRootSlash: false,
      addPrefix: '../'
    }))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.replace('bower_components/bootstrap-sass-official/assets/fonts/bootstrap','../fonts'))
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

gulp.task('images', function () {
  return gulp.src(paths.images)
    .pipe($.newer('.tmp/images'))
    .pipe($.imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
    }))
    .pipe(gulp.dest('.tmp/images'))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size());
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe($.newer('dist/fonts'))
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size());
});

gulp.task('clean', function () {
  return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.rimraf());
});

gulp.task('build', ['html', 'partials', 'images', 'fonts']);
