const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        //background: './src/background.ts',
        content: './src/content/index.ts',
        popup: './src/popup/popup.ts'  // Nur falls  popup.ts wirklich verwendet wird
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
                // Kopiert manifest.json direkt in "dist/"
                { from: 'src/manifest.json', to: '.' },
                { from: 'src/icons', to: 'icons' },
                // Falls popup.html vorhanden ist:
                { from: 'src/popup/popup.html', to: '.' }
            ]
        })
    ],
    mode: 'development',
    devtool: 'source-map'  // kein  eval() in den generierten Dateien
};
