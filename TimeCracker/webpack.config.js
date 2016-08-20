const webpack = require('webpack');
const path = require('path');
var PathChunkPlugin = require('path-chunk-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');

// var vendorScripts = {
//     'jquery': path.resolve(node_modules, 'jquery/dist/jquery.min.js'),
// };

const outputPath = path.resolve(__dirname, 'Content/build');
const appPath = path.join(__dirname, '/www/app.jsx');
const HOST = "localhost";
const PORT = 3000;

const config = {
    entry: {
        // index: path.join(__dirname, '/www/index.html'),
        app: [
            appPath
        ],
        'vendor': [
                'webpack-dev-server/client?https://' + HOST + ':' + PORT + '/', // WebpackDevServer host and port
                'webpack/hot/only-dev-server',
                'jquery' // "only" prevents reload on syntax errors
            ]
            /*.concat(Object.keys(vendorScripts))*/
    },
    devtool: 'eval',
    output: {
        path: outputPath, // Path of output file
        filename: '[name].js',
        publicPath: '//' + HOST + ':' + PORT + '/Content/build'
    },

    // Server Configuration options
    devServer: {
        port: 3000, // Port Number
        host: 'localhost',
    },
    module: {
        loaders: [
            /*{
                        test: /jquery/,
                        loader: 'expose?$!expose?jQuery'
                    }, */
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    'style', // backup loader when not building .css file
                    'css!autoprefixer-loader' // loaders to preprocess CSS
                ),
            }, {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file?name=fonts/[name].[ext]'
            }, {
                test: /\.(jpe?g|png|gif|ico|svg)$/i,
                loader: 'url-loader?name=images/[name].[ext]&limit=1'
            }, {
                test: /.jsx?$/, // Match both .js and .jsx
                loader: ['babel-loader'], // babel loads jsx and es6-7
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react'],
                    plugins: [
                        "transform-class-properties",
                        "syntax-object-rest-spread",
                        "transform-object-rest-spread",
                        "babel-root-import",
                    ]
                }
            }
        ]
    },
    externals: {
        jquery: 'jQuery'
    },
    plugins: [
        // Enables Hot Modules Replacement
        new webpack.HotModuleReplacementPlugin(),
        // Allows error warnings but does not stop compiling.
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                // This has effect on the react lib size
                'NODE_ENV': JSON.stringify('production'),
            }
        }),

        // static assets
        CopyWebpackPlugin([{
            from: path.join(__dirname, '/www/images'),
            to: outputPath + '/images'
        }]),
        // Vendor scripts dependencies
        new PathChunkPlugin({
            name: 'vendor',
            test: 'node_modules'
        }),
        // CSS file
        new ExtractTextPlugin("[name].css", {
            allChunks: true,
            // publicPath: './'
        }),
        // Global JS variables
        // new webpack.ProvidePlugin({
        //     // $: "jquery",
        //     // jQuery: "jquery"
        //     $: "jquery",
        //     jQuery: "jquery",
        //     "window.jQuery": "jquery"
        // })
    ],
    resolve: {
        extensions: ["", ".js", ".jsx"]
    }
};

module.exports = config;
