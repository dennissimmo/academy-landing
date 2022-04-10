import replace from "gulp-replace"; // Search and replace
import plumber from "gulp-plumber"; // Handling errors
import notify from "gulp-notify"; // Messages (notificaions)
import browsersync from "browser-sync"; // Local server
import newer from "gulp-newer"; // Check updates
import ifPlugin from "gulp-if"; // If condition;

// Export object

export const plugins = {
    if: ifPlugin,
    replace: replace,
    plumber: plumber,
    notify: notify,
    browsersync: browsersync,
    newer: newer,
}