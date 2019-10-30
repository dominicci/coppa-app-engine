const { sendWelcomeEmail } = require('../../exacttarget/welcome-email')

/**
 * Triggered by PubSub event new-account
 * Event is published from publishNewAccountEvent
 * https://cloud.google.com/functions/docs/tutorials/pubsub
 *
 * @param event
 */
exports.handleNewAccountEventWelcomeEmail = event =>
  sendWelcomeEmail(JSON.parse(Buffer.from(event.data, 'base64').toString()))
