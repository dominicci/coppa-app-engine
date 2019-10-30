// Get a hold of CIRCLE_CI environment variables
// Needs to export a function that returns a value

const base64ToJson = base64 => JSON.parse(Buffer.from(base64, 'base64').toString())

module.exports = () => ({
  GCLOUD_PROJECT_ID: process.env.GCLOUD_PROJECT_ID || 'digital-xyz',
  GCLOUD_SERVICE_KEY: process.env.GCLOUD_SERVICE_KEY
    ? base64ToJson(process.env.GCLOUD_SERVICE_KEY)
    : '~/.gcloud/keyfile.json'
})
