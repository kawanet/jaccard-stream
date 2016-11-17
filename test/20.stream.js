#!/usr/bin/env mocha

/* jshint mocha:true */

var assert = require("chai").assert;
var concat = require("concat-stream");
var csv = require("csv");
var fs = require("fs");
var ndjson = require("ndjson");

var JaccardStream = require("../");

var TITLE = __filename.replace(/^.*\//, "");

describe(TITLE, function() {
  it("sample/array-stream.json", function(done) {
    fs.createReadStream("sample/array-stream.json", "utf-8")
      .pipe(ndjson.parse())
      .pipe(JaccardStream({array: true}))
o      .pipe(ndjson.stringify())
      .pipe(concat(then));

    function then(text) {
      assert.equal(text + "", fs.readFileSync("expected/array-stream.json", "utf-8"));
      done();
    }
  });

  it("sample/object-stream.json", function(done) {
    fs.createReadStream("sample/object-stream.json", "utf-8")
      .pipe(ndjson.parse())
      .pipe(JaccardStream({filter: filter}))
      .pipe(ndjson.stringify())
      .pipe(concat(then));

    function filter(index, sourceId, targetId) {
      return {source: sourceId, target: targetId, value: index};
    }

    function then(text) {
      assert.equal(text + "", fs.readFileSync("expected/object-stream.json", "utf-8"));
      done();
    }
  });

  it("sample/without-header.csv", function(done) {
    fs.createReadStream("sample/without-header.csv", "utf-8")
      .pipe(csv.parse())
      .pipe(JaccardStream({array: true}))
      .pipe(csv.stringify())
      .pipe(concat(then));

    function then(text) {
      assert.equal(text + "", fs.readFileSync("expected/without-header.csv", "utf-8"));
      done();
    }
  });

  it("sample/with-header.csv", function(done) {
    fs.createReadStream("sample/with-header.csv", "utf-8")
      .pipe(csv.parse({columns: true}))
      .pipe(JaccardStream())
      .pipe(csv.stringify({header: true}))
      .pipe(concat(then));

    function then(text) {
      assert.equal(text + "", fs.readFileSync("expected/with-header.csv", "utf-8"));
      done();
    }
  });
});
