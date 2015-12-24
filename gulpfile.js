const gulp = require('gulp');
const sass = require('gulp-sass');
const jade = require('gulp-jade');

const path = require('path');

const SASS_DIR = path.resolve(
  path.dirname(require.resolve('bootstrap/package.json')),
  path.dirname(require('bootstrap/package.json').sass)
);

gulp.task('sass', function () {
  return gulp.src('style/character.scss', { base: 'style/' })
    .pipe(sass({
      includePaths: [
        SASS_DIR
      ],
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('jade', function () {
  return gulp.src('main.jade')
    .pipe(jade({
      pretty: true,
      locals: {
        character: require('./character'),
      },
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('default', [
  'sass',
  'jade',
]);
