'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');

const path = require('path');

const SASS_DIR = path.resolve(
  path.dirname(require.resolve('bootstrap/package.json')),
  path.dirname(require('bootstrap/package.json').sass)
);

gulp.task('sass', function () {
  return gulp.src('lib/html/style/character.scss', { base: 'lib/html/style/' })
    .pipe(sass({
      includePaths: [
        SASS_DIR
      ],
    }))
    .pipe(gulp.dest('lib/html/style'));
});

gulp.task('default', [
  'sass'
]);
