const { get } = require('axios')
const { GIGYA_KEY, GIGYA_SECRET } = require('../config')
const { handleAxios } = require('../shared')

const fetchAddresses = uid => {
  const options = {
    params: {
      UID: uid,
      httpStatusCodes: true,
      apiKey: GIGYA_KEY,
      secret: GIGYA_SECRET,
    },
  }

  return get('https://accounts.us1.gigya.com/accounts.getAccountInfo', options)
    .then(...handleAxios)
    .then(response => response.data.addresses || [])
}

/**
 * Get Addresses array from Gigya
 *
 * @param req
 * @returns {Promise<addresses[]>}
 */
exports.getAddresses = (req, res) =>
  fetchAddresses(req.query.uid)
    .then(result => res.json(result))
    .catch(({ code, error }) => res.status(code).json(error))

exports.fetchAddresses = fetchAddresses
