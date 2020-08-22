const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')

module.exports = {
    entry: './dist/default.js',
    output: {
        path: path.resolve(__dirname, 'export'),
        filename: 'devtools.js',
        publicPath: './dist',
        library: 'VueStateStoreDevtools',
        libraryTarget: 'this',
        libraryExport: 'default'
    },
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    }
}
