import pkg from './package.json';
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

const babelPluginConfig = babel({
  exclude: 'node_modules/**',
  presets: [
    'flow',
    [
      'env',
      {
        useBuiltIns: false,
        modules: false
      }
    ]
  ]
});

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.unpkg.replace('.min.', '.'),
        format: 'umd',
        name: pkg.name,
        sourcemap: true
      },
      {
        file: pkg.main,
        format: 'cjs'
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    plugins: [
      resolve(),
      babelPluginConfig
    ]
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.unpkg,
        format: 'umd',
        name: pkg.name,
        sourcemap: true
      }
    ],
    plugins: [
      resolve(),
      babelPluginConfig,
      uglify()
    ]
  }
];
