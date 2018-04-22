require('babel-register')({
  ignore: 'node_modules/**',
  presets: [
    'flow',
    [
      'env', {
        targets: {
          node: 'current'
        }
      }
    ]
  ]
});
