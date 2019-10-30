const PubSub = require('@google-cloud/pubsub')
const config = require('../../config')
const { GCLOUD_PROJECT_ID } = require('../../sls')

// Function will be running in the same Cloud project,
// Thus, no authentication is needed
const pubsub = new PubSub({ projectId: GCLOUD_PROJECT_ID })

// We publish to a different stage, so only one CF will subscribe to it
// Otherwise, multiple CFs will trigger, and user will receive multiple emails
const topic = pubsub.topic(`${config.BRAND_CODE}-${config.STAGE}-new-account`, { autoCreate: true })

const publisher = topic.publisher()

/**
 * Publish to Google Pub/Sub user's information
 *
 * We destruct to prevent publishing private information
 */
exports.publishNewAccountEvent = ({ email, uid, banner, source, lang, hasAgreedTerms }) =>
  publisher.publish(Buffer.from(JSON.stringify({ email, uid, banner, source, lang, hasAgreedTerms })))
