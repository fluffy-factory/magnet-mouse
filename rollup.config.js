import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

let outputFolder = 'lib/';
let outputDocsFolder = 'docs/assets/js/';
let inputFolder = 'src/';
let name = 'MagnetMouse';

export default [
  {
    input: inputFolder + 'index.js',
    output: {
      file: outputDocsFolder + 'magnet-mouse.min.js',
      format: 'iife',
      name: name
    },
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**'
      }),
      terser()
    ]
  },
  {
    input: inputFolder + 'index.js',
    output: {
      file: outputFolder + 'magnet-mouse.min.js',
      format: 'iife',
      name: name
    },
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**'
      }),
      terser()
    ]
  }
];

