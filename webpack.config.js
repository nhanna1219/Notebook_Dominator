const path = require("path");

module.exports = {
  target: 'node',
  entry: {
    attendance: './app/public/js/user/attendance.js',
    users: './app/public/js/admin/users.js',
    login: './app/public/js/login.js',
    home: './app/public/js/user/home.js',
    notebook: './app/public/js/user/notebook.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  ignoreWarnings: [
    {
      module: /node_modules\/express\/lib\/view\.js/,
      message: /the request of a dependency is an expression/,
    },
  ],
  devtool: 'source-map',
  mode: 'development',
};
