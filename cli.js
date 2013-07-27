#!/usr/bin/env node
'use strict';

var path = require('path');
var programmaticRunner = require('./programmaticRunner');

var filePath = path.join(process.cwd(), process.argv[2]);
var adapter = require(filePath);

programmaticRunner(adapter, process.argv[3], function (err) {
  if (err) {
    console.log(err);
  }
});
