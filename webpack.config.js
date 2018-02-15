const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let cssStrategy = [
  'style-loader',
  'css-loader',
  'sass-loader',
]

let public = 'http://0.0.0.0:3000/static/bundles/';

let devEntries = [
  'webpack-dev-server/client?http://localhost:3000',
  'webpack/hot/only-dev-server',
]

if (process.env.NODE_ENV == 'production') {
  devEntries = [];

  public = 'static/bundles/';

  cssStrategy = ExtractTextPlugin.extract({
      use: [
        'css-loader',
        'sass-loader'
      ]
  });
}

module.exports = {
  context: __dirname,
  entry: [
    ...devEntries,
    './assets/scss/main.scss',
    './assets/js/main.js'
  ],
  output: {
    path: path.resolve(__dirname, './static/bundles'),
    // chunkFilename: '[name]-[hash].js',
    filename: '[name]-[hash].js',
    publicPath: public,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'css-loader',
      },
      {
        test: /\.scss$/,
        use: cssStrategy
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: true,
          loaders: {
            'sass': cssStrategy
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  plugins: [
    new ExtractTextPlugin('[name]-[hash].css'),
    new BundleTracker({path: __dirname, filename: './webpack-stats.json', indent: '  '}),
    new CleanWebpackPlugin(['static/bundles']),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor-[hash].js',
      minChunks(module, count) {
        var context = module.context;

        if (typeof context !== 'string') {
          return false;
        }

        return context.indexOf('node_modules') !== -1;
      },
    }),
  ],
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
