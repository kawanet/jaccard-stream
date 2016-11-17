#!/usr/bin/env node

var fs = require("fs");
var JaccardStream = require("../");

function CLI(opts, input, output) {
  var optI = {};
  var optJ = {};
  var optO = {};
  var param = {};

  if (input === "-") input = null;
  if (output === "-") output = null;

  var first = opts && opts[0];
  if (first === "-") opts.split("").forEach(function(c) {
    param[c] = 1;
  });

  // read first line header when -N given
  optI.columns = !!param.N;

  // output CSV header when -n given
  optO.header = !!param.n;

  // array mode when -n NOT given
  optJ.array = !param.n;

  var parse;
  if (param.J) parse = _require("ndjson").parse(optI);
  if (param.C) parse = _require("csv").parse(optI);

  var stringify;
  if (param.j) stringify = _require("ndjson").stringify(optO);
  if (param.c) stringify = _require("csv").stringify(optO);

  if (!parse || !stringify) {
    var cmd = process.argv[1].split("/").pop();
    console.warn("Usage: " + cmd + " [-CJcjNn] [input] [output]");
    console.warn("");
    console.warn("  C: input format is CSV file");
    console.warn("  J: input format is JSON stream (ndjson)");
    console.warn("  c: output format is CSV file");
    console.warn("  j: output format is JSON stream (ndjson)");
    console.warn("  N: detect column names from the first line of input CSV");
    console.warn("  n: output with named columns");
    process.exit(1);
  }

  var read = input ? fs.createReadStream(input, "utf-8") : process.stdin;

  var jaccard = JaccardStream(optJ);

  var write = output ? fs.createWriteStream(output) : process.stdout;

  read.pipe(parse).pipe(jaccard).pipe(stringify).pipe(write);
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
