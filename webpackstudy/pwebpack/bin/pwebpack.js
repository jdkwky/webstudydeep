#! /usr/bin/env node

console.log('start');

const path = require('path');

const config = require(path.resolve('webpack.config.js'));

const Compiler = require('../lib/Compiler.js');

const compiler = new Compiler(config);
compiler.hooks.entryOption.call();
compiler.run();
