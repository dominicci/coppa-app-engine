const axios = require('axios')
const { of, reject, tryP } = require('fluture')
const { verifyParams, getParams, filterResponse, isShippingAvailable } = require('./verify-address')

const editShippingAddressRequest = params =>
  tryP(() =>
    axios.get(
      'http://ws.strikeiron.com/StrikeIron/NAAddressVerification6/NorthAmericanAddressVerificationService/NorthAmericanAddressVerification',
      { params }
    )
  )

// verifyAddress :: (HttpRequest, HttpResponse) -> Cancel
const verifyAddress = (req, res) =>
  (verifyParams(req.body.country) ? of(req.body) : reject({ code: 400, error: 'Country not valid' }))
    .map(getParams)
    .chain(editShippingAddressRequest)
    .map(filterResponse)
    .map(isShippingAvailable)
    .fork(error => res.status(error.code || 500).json(error), data => res.json(data))

module.exports = {
  verifyParams,
  getParams,
  filterResponse,
  verifyAddress,
  isShippingAvailable,
}
