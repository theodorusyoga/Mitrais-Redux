var webpack = require("webpack");
var path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: './main.js',
    output:
    {
        path: './',
        filename: 'index.js'
    },
    devServer: {
        inline: true,
        port: 5000
    },
    module:
    {
        loaders:
        [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'react']
            }
        }
        ]
    },
    //browserFS
    resolve: {
        // Use our versions of Node modules.
        root: path.resolve(__dirname),
        alias: {
            'fs': 'browserfs/dist/shims/fs.js',
            'buffer': 'browserfs/dist/shims/buffer.js',
            'path': 'browserfs/dist/shims/path.js',
            'bufferGlobal': 'browserfs/dist/shims/bufferGlobal.js',
            'bfsGlobal': require.resolve('browserfs')
        }
    },
    plugins: [
        // Expose BrowserFS, process, and Buffer globals.
        // NOTE: If you intend to use BrowserFS in a script tag, you do not need
        // to expose a BrowserFS global.
        new webpack.ProvidePlugin({ BrowserFS: 'bfsGlobal', Buffer: 'bufferGlobal' }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ],
    // DISABLE Webpack's built-in process and Buffer polyfills!
    node: {
        fs: 'empty'
    }
} 