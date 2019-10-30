const axios = require('axios')
const { pipe, defaultTo, head, mergeAll, pickAll, tail } = require('ramda')
const { GIGYA_KEY, GIGYA_SECRET } = require('../config')
const { handleAxios } = require('../shared')

// atgId is in the form of `a<unix>`
// we compare the unix to return the most recent one first
const sortByAtgId = addresses => addresses.sort((a, b) => +tail(a.atgId) - +tail(b.atgId))
const profileFields = ['birthMonth', 'birthDay', 'birthYear', 'firstName', 'lastName']
const getFirstAddress = addresses => pipe(defaultTo([]), sortByAtgId, head, defaultTo({}))(addresses)
const processAddresses = response => mergeAll([
  // return most recent data.address
  getFirstAddress(response.data.addresses),
  // override common profile/data.address fields with profile's
  pickAll(profileFields, response.profile),
  // override common address/phone fields with data.phone
  { phone: response.data.phone },
])

const fetchQuickProfile = req =>
  axios
    .get('https://accounts.us1.gigya.com/accounts.getAccountInfo', {
      params: {
        UID: req.query.uid,
        httpStatusCodes: true,
        apiKey: GIGYA_KEY,
        secret: GIGYA_SECRET,
      },
    })
    .then(...handleAxios)
    .then(response => processAddresses(response))

/**
 * Get Quick Profile from Gigya
 *
 * @param req
 * @returns {Promise}
 */
exports.getQuickProfile = (req, res) =>
  fetchQuickProfile(req)
    .then(result => res.json(result))
    .catch(({ code, error }) => res.status(code).json(error))

exports.fetchQuickProfile = fetchQuickProfile
exports.processAddresses = processAddresses
