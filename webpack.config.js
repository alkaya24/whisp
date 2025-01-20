const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        content: './src/content/index.ts',
        popup: './src/popup/popup.ts',
    },
    output: {
        path: path.resolve(process.cwd(), 'dist'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/manifest.json', to: '.' },
                { from: 'src/icons', to: 'icons' },
                { from: 'src/popup/popup.html', to: '.' },
            ],
        }),
    ],
    mode: 'development',
    devtool: 'source-map',
};
