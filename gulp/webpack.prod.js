import fs from 'fs';
import FileIncludeWebpackPlugin from 'file-include-webpack-plugin-replace';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from "copy-webpack-plugin";

import * as path from 'path';

const srcFolder = "src";
const builFolder = "docs";
const rootFolder = path.basename(path.resolve());

const paths = {
    src: path.resolve(srcFolder),
    build: path.resolve(builFolder)
}
const config = {
    mode: "development",
    devtool: 'inline-source-map',
    optimization: {
        minimize: false
    },
    entry: [
        `${paths.src}/js/app.js`
    ],
    output: {
        path: `${paths.build}`,
        filename: 'js/app.min.js',
        publicPath: '/'
    },
    devServer: {
        historyApiFallback: true,
        static: paths.build,
        open: true,
        compress: true,
        port: 'auto',
        hot: true,
        host: 'local-ip', // localhost

        // Расскоментировать на слабом ПК
        // (в режиме разработчика, папка с результаттом будет создаваться на диске)
        /*
        devMiddleware: {
            writeToDisk: true,
        },
        */

        watchFiles: [
            `${paths.src}/**/*.html`,
            `${paths.src}/**/*.htm`,
            `${paths.src}/img/**/*.*`
        ],
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                exclude: `${paths.src}/fonts`,
                use: [
                    'style-loader',
                    {
                        loader: 'string-replace-loader',
                        options: {
                            search: '@img',
                            replace: '../img',
                            flags: 'g'
                        }
                    }, {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 1,
                            modules: false,
                            url: {
                                filter: (url, resourcePath) => {
                                    if (url.includes("img/") || url.includes("fonts/")) {
                                        return false;
                                    }
                                    return true;
                                },
                            },
                        },
                    }, {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        }
                    }
                ],
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: `${srcFolder}/img`, to: `img`,
                    noErrorOnMissing: true,
                    force: true
                }, {
                    from: `${srcFolder}/files`, to: `files`,
                    noErrorOnMissing: true,
                    force: true
                },
            ],
        }),
    ],
    resolve: {
        alias: {
            "@scss": `${paths.src}/scss`,
            "@js": `${paths.src}/js`,
            "@img": `${paths.src}/img`
        },
    },
}
export default config;