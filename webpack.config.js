
module.exports = {
    mode: "production",
    entry: {
        main: './src/main.js',
    },
    output: {
        filename: 'sact.js',
        path: './dist/'
    },
    // optimization: {
    //     minimize: false,
    // },
};