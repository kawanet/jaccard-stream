#!/usr/bin/env mocha

/* jshint mocha:true */

var assert = require("chai").assert;
var JaccardStream = require("../");

var TITLE = __filename.replace(/^.*\//, "");

describe(TITLE, function() {
  var inputArray = [
    ["item1", "user1"],
    ["item1", "user2"],
    ["item2", "user2"],
    ["item2", "user3"],
    ["item2", "user4"],
    ["item3", "user1"],
    ["item3", "user2"],
    ["item3", "user5"]
  ];

  var inputObject = [
    {"item": "item1", "user": "user1"},
    {"item": "item1", "user": "user2"},
    {"item": "item2", "user": "user2"},
    {"item": "item2", "user": "user3"},
    {"item": "item2", "user": "user4"},
    {"item": "item3", "user": "user1"},
    {"item": "item3", "user": "user2"},
    {"item": "item3", "user": "user5"}
  ];

  var expectedArray = [
    ["item1", "item2", 0.25],
    ["item1", "item3", 0.6666666666666666],
    ["item2", "item3", 0.2]
  ];

  var expectedObject = [
    {"source": "item1", "target": "item2", "value": 0.25},
    {"source": "item1", "target": "item3", "value": 0.6666666666666666},
    {"source": "item2", "target": "item3", "value": 0.2}
  ];

  it("array mode", function(done) {
    var buf = [];
    var jaccard = JaccardStream({array: true});
    inputArray.forEach(function(row) {
      jaccard.write(row);
    });
    jaccard.on("data", function(row) {
      buf.push(row);
    });
    jaccard.on("end", function() {
      assert.deepEqual(buf, expectedArray);
      done();
    });
    jaccard.end();
  });

  it("object mode", function(done) {
    var buf = [];
    var jaccard = JaccardStream();
    inputObject.forEach(function(row) {
      jaccard.write(row);
    });
    jaccard.on("data", function(row) {
      buf.push(row);
    });
    jaccard.on("end", function() {
      assert.deepEqual(buf, expectedObject);
      done();
    });
    jaccard.end();
  });
});
