const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');

const config = {
    entry: './client/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html'),
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css'
        }),
        new DotenvWebpackPlugin({
            path: '.env'
        })
    ],
    resolve: {
        extensions: [".js", ".jsx", ".ts"],
        preferRelative: true
    },
    devServer: {
        static: {
            publicPath: "/dist",
            directory: path.resolve(__dirname, 'dist')
        },
        port: 8080,
        historyApiFallback: true,
        proxy: { "/": "http://localhost:3000" }
    }
};

module.exports = config;