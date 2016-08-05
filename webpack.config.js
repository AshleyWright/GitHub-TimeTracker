/* global module:false, require:false, process: false */
var argv    = require('yargs').argv,
    webpack = require('webpack');

module.exports = {
    devtool: '#source-map',
    entry: [
        './js/init.js'
    ],
    output: {
        filename: 'script.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    'presets': ['es2015'],
                    'plugins': [
                        'syntax-exponentiation-operator',
                        'transform-function-bind',
                        'transform-class-properties',
                        'transform-object-rest-spread'
                    ]
                }
            }
        ]
    },
    plugins: {
        'PROD': [
            new webpack.optimize.UglifyJsPlugin({minimize: true})
        ]
    }[(argv.env || process.env.NODE_ENV).toUpperCase()] || [],
    resolve: {
        extensions: ['', '.js', '.json']
    }
};