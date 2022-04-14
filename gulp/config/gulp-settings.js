// Get name of project folder
import * as nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());

// Path for folder with sources and results
const buildFolder = `./docs`;
const srcFolder = `./src`;

// Path to folders and files in project
export const path = {
    build: {
        js: `${buildFolder}/js/`,
        html: `${buildFolder}/`,
        css: `${buildFolder}/css/`,
        files: `${buildFolder}/files/`,
        fonts: `${buildFolder}/fonts/`,
        images: `${buildFolder}/img/`
    },
    src: {
        js: `${srcFolder}/js/app.js`,
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
        svg: `${srcFolder}/img/**/*.svg`,
        html: `${srcFolder}/*.html`,
        files: `${srcFolder}/files/**/*.*`,
        scss: `${srcFolder}/scss/style.scss`,
        svgicons: `${srcFolder}/svgicons/*.svg`
    },
    watch: {
        js: `${srcFolder}/js/**/*.js`,
        html: `${srcFolder}/**/*.html`,
        scss: `${srcFolder}/scss/**/*.scss`,
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp,ico,svg}`,
        files: `${srcFolder}/files/**/*.*`
    },
    clean: buildFolder,
    buildFolder: buildFolder,
    srcFolder: srcFolder,
    rootFolder: rootFolder,
    ftp: `test`
}

export let configFTP = {
    host: "", // Address of FTP server, IP
    user: "", // Username
    password: "", // Password
    parallel: 5 // amount of threads, streams
}