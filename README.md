# jaccard-stream

Jaccard Similarity Coefficient Index Stream Transform

[![npm version](https://badge.fury.io/js/jaccard-stream.svg)](http://badge.fury.io/js/jaccard-stream) [![Build Status](https://travis-ci.org/kawanet/jaccard-stream.svg?branch=master)](https://travis-ci.org/kawanet/jaccard-stream)

## SYNOPSIS

### Log CSV to Links CSV

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

### Log JSON to Links JSON

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

```sh
$ npm install jaccard-stream csv ndjson
$ PATH=./node_modules/.bin:$PATH
$ head node_modules/jaccard-stream/sample/*.*
$ jaccard-stream -CNc sample/with-header.csv
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
