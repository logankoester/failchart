#!/usr/bin/env node

var path = require('path');

module.exports = {
  summarize: require(path.join(__dirname, 'lib', 'summarize'))
}
