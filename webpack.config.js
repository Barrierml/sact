const path = require("path");
module.exports = {
    mode: "production",
    entry: {
        main: './src/main.js',
    },
    output: {
        filename: 'sact.js',
        path:  path.resolve(__dirname,"dist"),
    },
    // optimization: {
    //     minimize: false,
    // },
};