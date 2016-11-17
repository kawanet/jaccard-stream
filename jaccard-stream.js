// jaccard-stream.js

var util = require("util");
var Transform = require("stream").Transform;
var Jaccard = require("../jaccard-index");

module.exports = JaccardStream;

util.inherits(JaccardStream, Transform);

function JaccardStream(options) {
  if (!(this instanceof JaccardStream)) return new JaccardStream(options);

  if (!options) options = {};
  options.objectMode = true;

  Transform.call(this, options);
  var logs = {};

  var stream = this;
  stream._transform = _transform;
  stream._flush = _flush;
  //stream.on("finish", onFinish);

  var jaccard = new Jaccard(options);
  jaccard.expire = 0;
  jaccard.getLog = getLog;
  if (!options.filter) jaccard.filter = filter;

  function filter(index, sourceId, targetId) {
    return [sourceId, targetId, index];
  }

  function _transform(data, encoding, callback) {
    if (!data) return callback();
    var itemId = data.item || data[0];
    var userId = data.user || data[1];
    var itemLog = logs[itemId] || (logs[itemId] = {});
    itemLog[userId]++;
    if (callback) callback();
  }

  function _flush(callback) {
    jaccard.getLinks(getItems, null, onLink).then(function() {
      if (callback) callback();
    }, callback);
  }

  function getItems() {
    return Object.keys(logs);
  }

  function getLog(itemId) {
    var itemLog = logs[itemId];
    if (itemLog) return Object.keys(itemLog);
  }

  function onLink(link) {
    stream.push(link);
  }
}

