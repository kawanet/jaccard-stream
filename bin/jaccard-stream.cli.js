#!/usr/bin/env node

var fs = require("fs");
var JaccardStream = require("../");

function CLI(opts, input, output) {
  var optP = {}; // options for parse
  var optJ = {}; // options for Jaccard tranform
  var optS = {}; // options for stringify
  var param = {};

  if (input === "-") input = null;
  if (output === "-") output = null;

  var first = opts && opts[0];
  if (first === "-") opts.split("").forEach(function(c) {
    param[c] = 1;
  });

  // read first line header when -N given
  if (param.N) optP.columns = true;

  // output CSV header when -n given
  if (param.n) optS.header = true;

  // array mode when -n NOT given
  if (!param.n) optJ.array = true;

  // tab separated values
  if (param.T) optP.delimiter = "\t";
  if (param.t) optS.delimiter = "\t";

  var parse;
  if (param.J) parse = _require("ndjson").parse(optP);
  if (param.C || param.T) parse = _require("csv").parse(optP);

  var stringify;
  if (param.j) stringify = _require("ndjson").stringify(optS);
  if (param.c || param.t) stringify = _require("csv").stringify(optS);

  if (!parse || !stringify) {
    var cmd = process.argv[1].split("/").pop();
    console.warn("Usage: " + cmd + " [-CJcjNn] [input] [output]");
    console.warn("");
    console.warn("  C: input format is CSV file (comma separated values)");
    console.warn("  T: input format is TSV file (tab separated values)");
    console.warn("  J: input format is newline-delimited JSON stream (ndjson)");
    console.warn("  c: output format is CSV file");
    console.warn("  t: output format is TSV file");
    console.warn("  j: output format is newline-delimited JSON stream (ndjson)");
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
