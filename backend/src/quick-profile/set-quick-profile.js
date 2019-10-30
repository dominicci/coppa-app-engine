const axios = require('axios')
const { tryP } = require('fluture')
const { defaultTo } = require('ramda')
const { fetchQuickProfile } = require('./get-quick-profile')
const { fetchSetAddress } = require('../address/set-address')
const { userWebhookReq } = require('../gale/user-webhook.io')
const { GIGYA_KEY, GIGYA_SECRET } = require('../config')
const { handleAxios } = require('../shared')

const saveProfile = ({ uid, profile }) =>
  axios.get('https://accounts.us1.gigya.com/accounts.setAccountInfo',
    {
      params: {
        profile: JSON.stringify(profile),
        data: JSON.stringify({ profile: { completed: true } }),
        UID: uid,
        httpStatusCodes: true,
        apiKey: GIGYA_KEY,
        secret: GIGYA_SECRET,
      },
    })
    .then(...handleAxios)

const setQuickProfileReq = req => {

  // address.alias is required for addresses,
  // but not defined in quick-profile view
  const alias = defaultTo('Default')(req.body.profile.alias)
  const { uid, profile } = req.body
  const { firstName, lastName, birthDay, birthMonth, birthYear, atgId, country, zipcode } = profile

  const profileToSave = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    birthDay: birthDay,
    birthMonth: birthMonth,
    birthYear: birthYear
  }

  const address = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    birthDay: birthDay,
    birthMonth: birthMonth,
    birthYear: birthYear,
    alias: alias,
    atgId: atgId,
    country: country,
    zipcode: zipcode
  }

  return tryP(() => saveProfile({ uid, profile: profileToSave }))
    .chain(() => tryP(() => fetchSetAddress({ body: { uid, address } })))
    .chain(() => userWebhookReq(uid))
    .chain(() => tryP(() => fetchQuickProfile({ query: { uid: uid } })))
}

/**
 * Save/Update a Profile/Address in Gigya
 *
 * 1) Get current addresses
 * 2) If an atgId is sent, replace the current one with same atgId
 *    If no current one with same atgId is found, throw an error
 * 3) If no atgId is sent, generate one and push the address into the array
 *
 */
// setQuickProfile :: (HttpRequest, HttpResponse) -> Cancel
exports.setQuickProfile = (req, res) =>
  setQuickProfileReq(req).fork(
    ({ code, error }) => res.status(code).json(error),
    result => res.json(result)
  )

exports.setQuickProfileReq = setQuickProfileReq
