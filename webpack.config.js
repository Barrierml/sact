
module.exports = {
    mode: "production",
    entry: {
        app: './src/main.js',
    },
    output: {
        filename: 'Sact.js', //这里[]里的name就是app和search也就是entry里的key值
        path: 'C:\\Users\\Administrator\\Desktop\\immgarte\\222\\static\\js\\common\\'
    },
    // optimization: {
    //     minimize: false,
    // },
};