// https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/master/functions/pubsub/test/index.test.js
function PubSub() {}

function Publisher() {}

function Topic() {
  return new Publisher()
}

Publisher.prototype.publisher = function() {
  return this
}

PubSub.prototype.topic = function() {
  return new Topic()
}

Publisher.prototype.publish = function() {}

module.exports.PubSub = PubSub
module.exports.Topic = Topic
module.exports.Publisher = Publisher
