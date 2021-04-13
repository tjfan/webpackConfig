'use strict';
const path = require('path');
const JSZip = require('jszip');
const { RawSource } = require('webpack-sources');

const zip = new JSZip();

module.exports = class MyPlugin {
  constructor (options) {
    this.options = options;
  }
  apply (compiler) {
    compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
      const fold = zip.folder(this.options.name);
      for (let filename in compilation.assets) {  
        fold.file(filename, compilation.assets[filename].source());
      }

      zip.generateAsync({type: 'nodebuffer'}).then((content) => {
        const outputpath = path.join(this.options.outputpath, this.options.name + '.zip');
        const outPutRelativePath = path.relative(this.options.outputpath, outputpath);

        compilation.assets[outPutRelativePath] = new RawSource(content);
        callback();
      });
    });
  }
}