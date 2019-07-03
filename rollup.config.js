import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import multiEntry from 'rollup-plugin-multi-entry';
import commonjs from 'rollup-plugin-commonjs';

let outputFolder = 'lib/';
let outputDocsFolder = 'docs/';
let inputFolder = 'src/';
let name = 'MagnetMouse';

let pluginOptions = [
  multiEntry(),
  resolve({
    jsnext: true,
    browser: true
  }),
  commonjs(),
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

