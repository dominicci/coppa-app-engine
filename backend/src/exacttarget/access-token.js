const axios = require('axios')
const { EXACT_TARGET_CLIENT_ID, EXACT_TARGET_CLIENT_SECRET } = require('../config')
const { handleAxios } = require('../shared')

// Refer to https://developer.salesforce.com/docs/atlas.en-us.mc-getting-started.meta/mc-getting-started/get-access-token.htm
// Access tokens expire one hour after they are issued. If you attempt to use an expired token, you receive a 401 Unauthorized HTTP response.
// If this happens, refresh your access token by calling requestToken again.

// we return the same accessToken as long as it's not expired
let accessToken = {
  accessToken: null,
  expiresIn: 0, // 3600 (1 hour)
  issuedAt: 0, // unix time
}

// number of seconds since epoch
const getUnixTime = () => Date.now() / 1000

const isExpired = () => !accessToken.accessToken || accessToken.issuedAt + accessToken.expiresIn <= getUnixTime()

const getNewAccessToken = () =>
  axios
    .post('https://auth.exacttargetapis.com/v1/requestToken',
      {
        clientId: EXACT_TARGET_CLIENT_ID,
        clientSecret: EXACT_TARGET_CLIENT_SECRET,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    .then(...handleAxios)
    .then(response => {
      accessToken = response
      accessToken.issuedAt = getUnixTime()

      return accessToken
    })
    // if token just expired, issue a new one
    .catch(() => getNewAccessToken())

exports.getAccessToken = () => (isExpired() ? getNewAccessToken() : Promise.resolve(accessToken))
