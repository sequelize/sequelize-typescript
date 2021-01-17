/**
 * @type {MochaSetupOptions}
 */
module.exports = {
  extension: ['ts'],
  require: [
    'test/tsconfig.mocha.js'
  ],
  package: './package.json',
  'watch-files': ['test/**/*.spec.ts'],
  // 'watch-ignore': ['lib/vendor']
};
