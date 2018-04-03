var path = require('path')
var version = require('./package.json').version

const CopyPlugin = require('copy-webpack-plugin')

const vtkRules = require('vtk.js/Utilities/config/rules-vtk.js');
const commonRules = require('vtk.js/Utilities/config/rules-examples.js');

// Custom webpack rules are generally the same for all webpack bundles, hence
// stored in a separate local variable.
var rules = [
  { test: /\.css$/,
    use: ['style-loader', 'css-loader']
  },
  {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['env']
      }
    }
  }
].concat(vtkRules, commonRules)


module.exports = [
    {// Notebook extension
     //
     // This bundle only contains the part of the JavaScript that is run on
     // load of the notebook. This section generally only performs
     // some configuration for requirejs, and provides the legacy
     // "load_ipython_extension" function which is required for any notebook
     // extension.
     //
        node: {
          fs: 'empty',
        },
        entry: './lib/extension.js',
        output: {
            filename: 'extension.js',
            path: path.resolve(__dirname, '..', 'itkwidgets', 'static'),
            libraryTarget: 'amd'
        },
        resolve: {
          modules: [
            path.resolve(__dirname, 'node_modules'),
          ],
          alias: {
            './itkConfig$': path.resolve(__dirname, 'lib', 'itkConfigJupyter.js'),
          },
        },
    },
    {// Bundle for the notebook containing the custom widget views and models
     //
     // This bundle contains the implementation for the custom widget views and
     // custom widget.
     // It must be an amd module
     //
        node: {
          fs: 'empty',
        },
        entry: './lib/index.js',
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, '..', 'itkwidgets', 'static'),
            libraryTarget: 'amd'
        },
        devtool: 'source-map',
        module: {
            rules: rules
        },
        resolve: {
          modules: [
            path.resolve(__dirname, 'node_modules'),
          ],
          alias: {
            './itkConfig$': path.resolve(__dirname, 'lib', 'itkConfigJupyter.js'),
          },
        },
        plugins: [
          new CopyPlugin([
            {
              from: path.join(__dirname, 'node_modules', 'itk', 'WebWorkers', 'Pipeline.worker.js'),
              to: path.join(__dirname, '..', 'itkwidgets', 'static', 'itk', 'WebWorkers', 'Pipeline.worker.js')
            },
            {
              from: path.join(__dirname, 'lib', 'ZstdDecompress', 'web-build', 'ZstdDecompress.js'),
              to: path.join(__dirname, '..', 'itkwidgets', 'static', 'itk', 'Pipelines', 'ZstdDecompress.js')
            },
            {
              from: path.join(__dirname, 'lib', 'ZstdDecompress', 'web-build', 'ZstdDecompressWasm.js'),
              to: path.join(__dirname, '..', 'itkwidgets', 'static', 'itk', 'Pipelines', 'ZstdDecompressWasm.js')
            },
            {
              from: path.join(__dirname, 'lib', 'ZstdDecompress', 'web-build', 'ZstdDecompressWasm.wasm'),
              to: path.join(__dirname, '..', 'itkwidgets', 'static', 'itk', 'Pipelines', 'ZstdDecompressWasm.wasm')
            },
          ]),
        ],
      externals: ['@jupyter-widgets/base', {config: '{}'}]
    },
    {// Embeddable itk-jupyter-widgets bundle
     //
     // This bundle is generally almost identical to the notebook bundle
     // containing the custom widget views and models.
     //
     // The only difference is in the configuration of the webpack public path
     // for the static assets.
     //
     // It will be automatically distributed by unpkg to work with the static
     // widget embedder.
     //
     // The target bundle is always `dist/index.js`, which is the path required
     // by the custom widget embedder.
     //
        node: {
          fs: 'empty',
        },
        entry: './lib/embed.js',
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'amd',
            publicPath: 'https://unpkg.com/itk-jupyter-widgets@' + version + '/dist/'
        },
        devtool: 'source-map',
        module: {
            rules: rules
        },
        resolve: {
          modules: [
            path.resolve(__dirname, 'node_modules'),
          ],
          alias: {
            './itkConfig$': path.resolve(__dirname, 'lib', 'itkConfigJupyter.js'),
          },
        },
        plugins: [
          new CopyPlugin([
            {
              from: path.join(__dirname, 'node_modules', 'itk', 'WebWorkers', 'Pipeline.worker.js'),
              to: path.join(__dirname, 'dist', 'itk', 'WebWorkers', 'Pipeline.worker.js')
            },
            {
              from: path.join(__dirname, 'lib', 'ZstdDecompress', 'web-build', 'ZstdDecompress.js'),
              to: path.join(__dirname, 'dist', 'itk', 'Pipelines', 'ZstdDecompress.js')
            },
            {
              from: path.join(__dirname, 'lib', 'ZstdDecompress', 'web-build', 'ZstdDecompressWasm.js'),
              to: path.join(__dirname, 'dist', 'itk', 'Pipelines', 'ZstdDecompressWasm.js')
            },
            {
              from: path.join(__dirname, 'lib', 'ZstdDecompress', 'web-build', 'ZstdDecompressWasm.wasm'),
              to: path.join(__dirname, 'dist', 'itk', 'Pipelines', 'ZstdDecompressWasm.wasm')
            },
          ]),
        ],
        externals: ['@jupyter-widgets/base', {config: '{}'}]
    }
];
