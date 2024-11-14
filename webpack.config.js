const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        background: './src/background.ts',
        content: './src/content.ts',
        popup: './src/popup.ts'  // Nur falls  popup.ts wirklich verwendet wird
    },
    output: {
        path: path.resolve(__dirname, 'dist'),  // alle Dateien in "dist/"
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/manifest.json', to: '.' },
                { from: 'src/icons', to: 'icons' },
                // Kopiert manifest.json direkt in "dist/"
                // Falls popup.html vorhanden ist:
                { from: 'src/popup.html', to: '.' }
            ]
        })
    ],
    mode: 'development',
    devtool: 'source-map'  // kein  eval() in den generierten Dateien
};
