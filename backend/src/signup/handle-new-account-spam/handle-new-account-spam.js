const { spam } = require('../../newsletter/spam')

/**
 * Triggered by PubSub event new-account
 * Event is published from publishNewAccountEvent
 * https://cloud.google.com/functions/docs/tutorials/pubsub
 *
 * @param event
 */
exports.handleNewAccountEventSpam = event => spam(JSON.parse(Buffer.from(event.data, 'base64').toString()))
