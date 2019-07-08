import babel from 'rollup-plugin-babel';

let outputFolder = 'lib/';
let outputDocsFolder = 'docs/';
let inputFolder = 'src/';
let name = 'MagnetMouse';

let pluginOptions = [
  babel({
    exclude: 'node_modules/**',
  })
];

export default [
  {
    input: inputFolder + 'index.js',
    output: {
      file: outputFolder + 'magnet-mouse.es.js',
      format: 'iife',
      name: name
    }
  },
  {
    input: inputFolder + 'index.js',
    output: {
      file: outputDocsFolder + 'magnet-mouse.es.js',
      format: 'iife',
      name: name
    }
  },
  {
    input: inputFolder + 'index.js',
    output: {
      file: outputFolder + 'magnet-mouse.js',
      format: 'umd',
      name: name
    },
    plugins: pluginOptions
  }
];

