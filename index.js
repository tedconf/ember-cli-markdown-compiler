/* jshint node: true */
'use strict';

var Filter = require('broccoli-filter');
var marked = require('marked');
marked.setOptions({
  gfm: true,
  sanitize: true
});

function TemplateCompiler(inputNode, options) {
  if (!(this instanceof TemplateCompiler)) {
    return new TemplateCompiler(inputNode, options);
  }

  options = options || {};
  Filter.call(this, inputNode, options);
  this.compile = marked;
}

TemplateCompiler.prototype = Object.create(Filter.prototype);
TemplateCompiler.prototype.constructor = TemplateCompiler;
TemplateCompiler.prototype.extensions = ['md'];
TemplateCompiler.prototype.targetExtension = 'hbs';

TemplateCompiler.prototype.processString = function(string, relativePath) {
  return this.compile(string).replace(/{/g, '&#x7B;');
};

module.exports = {
  name: 'ember-cli-markdown-compiler',

  isDevelopingAddon: function() {
    return true;
  },

  setupPreprocessorRegistry: function(type, registry) {
    registry.add('template', {
      name: 'ember-cli-markdown-compiler',
      ext: ['md'],
      toTree: function(tree) {
        return TemplateCompiler(tree);
      }
    });

    if (type === 'parent') {
      this.parentRegistry = registry;
    }
  },

  included: function(app) {
    this._super.included.apply(this, arguments);

    this.setupPreprocessorRegistry('parent', app.registry);
  }

};
