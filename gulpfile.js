'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');

const path = require('path');

const SASS_DIR = path.resolve(
  path.dirname(require.resolve('bootstrap/package.json')),
  path.dirname(require('bootstrap/package.json').sass)
);

gulp.task('sass', () => {
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

gulp.task('lint', () => {
  return gulp.src([
    'src/**/*.js',
    'bin/**/*.js',
    '*.js',
    'test/**/*.js'
  ]).pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('mocha', () => {
  return gulp.src('test/**/*.js')
    .pipe(mocha());
});

gulp.task('test', [
  'lint', 'mocha'
]);
