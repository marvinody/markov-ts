/*module.exports =
  {
    mode: 'development',
    output: {
      filename: './build/dist-bundle-es5.js'
    },
    context: __dirname,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    forceAllTransforms: true
                  }
                ]
              ]
            }
          }
        }
      ]
    },
    name: 'es5',
    entry: './build/index.js'
  };
  */
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
