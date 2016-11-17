#!/usr/bin/env node

var fs = require("fs");
var JaccardStream = require("../");

function CLI(opts, input, output) {
  var first = opts && opts[0];

  if (first !== "-") {
    var cmd = process.argv[1].split("/").pop();
    console.warn("Usage: " + cmd + " [-CJcjm] [input] [output]");
    console.warn("  C: input format is CSV file");
    console.warn("  J: input format is JSON stream (ndjson)");
    console.warn("  c: output format is CSV file");
    console.warn("  j: output format is JSON stream (ndjson)");
    console.warn("  N: detect column names from the first line of input CSV");
    console.warn("  n: output with named columns");
    process.exit(1);
  }

  var optI = {};
  var optJ = {};
  var optO = {};
  var param = {};

  if (input === "-") input = null;
  if (output === "-") output = null;

  opts.split("").forEach(function(c) {
    param[c] = 1;
  });
  if (param.N) {
    optI.columns = true;
  }
  if (param.n) {
    optJ.filter = filter;
    optO.header = true;
  }

  var read = input ? fs.createReadStream(input, "utf-8") : process.stdin;

  var parse = param.J ? _require("ndjson").parse(optI) : _require("csv").parse(optI);

  var jaccard = JaccardStream(optJ);

  var stringify = param.j ? _require("ndjson").stringify(optO) : _require("csv").stringify(optO);

  var write = output ? fs.createWriteStream(output) : process.stdout;

  read.pipe(parse).pipe(jaccard).pipe(stringify).pipe(write);
}

function filter(index, sourceId, targetId) {
  return {source: sourceId, target: targetId, value: index};
}

function _require(name) {
  try {
    return require(name);
  } catch (e) {
    console.warn(e + "");
    var cmd = process.argv[1].split("/").pop();
    console.warn("'npm install " + name + "' before using " + cmd);
    process.exit(2);
  }
}

CLI.apply(null, Array.prototype.slice.call(process.argv, 2));
