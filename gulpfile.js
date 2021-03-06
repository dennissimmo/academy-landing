// NOTE: valid version for "webp-converter": "2.2.3",
// Main module
import gulp from 'gulp';
// Import path
import { path } from "./gulp/config/gulp-settings.js";
// Import common plugins
import { plugins } from "./gulp/config/gulp-plugins.js";

// Pass values in global variable
global.app = {
    isBuild: process.argv.includes('--build'),
    isDev: !process.argv.includes('--build'),
    path: path,
    gulp: gulp,
    plugins: plugins
}

// Import tasks

import { copy } from './gulp/config/gulp-tasks/copy.js';
import { reset } from './gulp/config/gulp-tasks/reset.js';
import { html } from './gulp/config/gulp-tasks/html.js';
import { server } from './gulp/config/gulp-tasks/server.js';
import { scss } from './gulp/config/gulp-tasks/scss.js';
import { js } from './gulp/config/gulp-tasks/js.js';
import { images } from './gulp/config/gulp-tasks/images.js';
import { otfToTtf, ttfToWoff, fontsStyle } from './gulp/config/gulp-tasks/fonts.js';
import { svgSprive } from './gulp/config/gulp-tasks/svgSprive.js';
import { zip } from './gulp/config/gulp-tasks/zip.js';

// Listener / Watcher to the files
function watcher() {
    gulp.watch(path.watch.files, copy);
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.scss, scss);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.images, images);
}

export { svgSprive }

// Sequence handling fonts
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

// Main tasks
const mainTasks = gulp.series(fonts, gulp.parallel(copy, html, scss, js, images));

// Build a scenario of tasks execution
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZIP = gulp.series(reset, mainTasks, zip);

// Export of scenaries
export { dev }
export { build }
export { deployZIP }

// Execution of scenario by default 
gulp.task('default', dev);