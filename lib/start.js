const gulp = require('gulp');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');

function doCompile() {
  gulp.src('pages/**/*.css')
    .pipe(postcss([
      require('postcss-import')(),
      require('postcss-mixins'),
      require('postcss-nested'),
      require('postcss-simple-vars')({ silent: true, }),
    ], { syntax: require('postcss-scss') }))
    .pipe(rename({
      extname: ".acss",
    }))
  .pipe(gulp.dest('pages'));
}

module.exports = function() {
  gulp.task('css', () => {
    doCompile();
  });

  doCompile();

  const watcher = gulp.watch('pages/**/*.css', ['css']);

  watcher.on('change', (event) => {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
}
