# jaccard-stream

Jaccard Similarity Coefficient Index Stream Transform

[![npm version](https://badge.fury.io/js/jaccard-stream.svg)](http://badge.fury.io/js/jaccard-stream) [![Build Status](https://travis-ci.org/kawanet/jaccard-stream.svg?branch=master)](https://travis-ci.org/kawanet/jaccard-stream)

## SYNOPSIS

### Event Model

```js
var JaccardStream = require("jaccard-stream");

var logs = [
  ["item1", "user1"],
  ["item1", "user2"],
  ["item2", "user2"],
  ["item2", "user3"],
  ["item2", "user4"],
  ["item3", "user1"],
  ["item3", "user2"],
  ["item3", "user5"]
];

var jaccard = JaccardStream();

jaccard.on("data", function(row) {
  console.warn(row); // output
});

jaccard.on("end", function() {
  // end of output
});

logs.forEach(function(row) {
  jaccard.write(row); // input
});

jaccard.end(); // end of input
```

Output:

```json
{"source":"item1","target":"item2","value":0.25}
{"source":"item1","target":"item3","value":0.6666666666666666}
{"source":"item2","target":"item3","value":0.2}
```

### Stream Model: Log CSV to Links CSV

```js
var JaccardStream = require("jaccard-stream");
var fs = require("fs");
var csv = require("csv");

var read = fs.createReadStream("sample/with-header.csv", "utf-8");

var parse = csv.parse({columns: true});

var jaccard = JaccardStream();

var stringify = csv.stringify({header: true});

var write = fs.createWriteStream("jaccard.csv");

read.pipe(parse).pipe(jaccard).pipe(stringify).pipe(write);
```

### Stream Model: Log JSON to Links JSON

```js
var JaccardStream = require("jaccard-stream");
var fs = require("fs");
var ndjson = require("ndjson");

var read = fs.createReadStream("sample/array-stream.json", "utf-8");

var parse = ndjson.parse();

var jaccard = JaccardStream();

var stringify = ndjson.stringify();

var write = fs.createWriteStream("jaccard.json");

read.pipe(parse).pipe(jaccard).pipe(stringify).pipe(write);
```

## CLI

Usage:

```
$ npm install jaccard-stream csv ndjson
$ PATH=./node_modules/.bin:$PATH
$ jaccard-stream -h
Usage: jaccard-stream [-CTJctjNnh] [input] [output]

  C: input is CSV file (comma separated values)
  T: input is TSV file (tab separated values)
  J: input is newline-delimited JSON stream (ndjson)
  c: output is CSV file
  t: output is TSV file
  j: output is newline-delimited JSON stream (ndjson)
  N: detect column names from the first line of input CSV
  n: output with named columns
  h: show this message
```

Try it with sample files:

```sh
$ jaccard-stream -CNcn sample/with-header.csv
$ jaccard-stream -Cc sample/without-header.csv
$ jaccard-stream -Jj sample/array-stream.json 
$ jaccard-stream -Jjn sample/object-stream.json 
```

## SEE ALSO

### NPM

- [https://www.npmjs.com/package/jaccard-stream](https://www.npmjs.com/package/jaccard-stream)
- [https://www.npmjs.com/package/jaccard-index](https://www.npmjs.com/package/jaccard-index)
- [https://www.npmjs.com/package/csv](https://www.npmjs.com/package/csv)
- [https://www.npmjs.com/package/ndjson](https://www.npmjs.com/package/ndjson)

### GitHub

- [https://github.com/kawanet/jaccard-stream](https://github.com/kawanet/jaccard-stream)

### Tests

- [https://travis-ci.org/kawanet/jaccard-stream](https://travis-ci.org/kawanet/jaccard-stream)

## LICENSE

MIT License

Copyright (c) 2016 Yusuke Kawasaki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
