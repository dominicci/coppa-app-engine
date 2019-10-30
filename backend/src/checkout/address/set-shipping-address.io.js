const axios = require('axios')
const { GIGYA_ACCOUNTS_URL, GIGYA_KEY, GIGYA_SECRET } = require('../../config')
const { get, elems, when, set, ifElse } = require('partial.lenses')
const { addresses, pickAddressFields } = require('./set-shipping-address')

const fetchAddresses = uid =>
  axios
    .get(`${GIGYA_ACCOUNTS_URL}/accounts.getAccountInfo`, {
      params: {
        UID: uid,
        httpStatusCodes: true,
        apiKey: GIGYA_KEY,
        secret: GIGYA_SECRET,
      },
    })
    .then(addresses)
    .catch(err => console.log(err))

const saveAddresses = ({ uid, addresses }) =>
  axios.get(`${GIGYA_ACCOUNTS_URL}/accounts.setAccountInfo`, {
    params: {
      data: JSON.stringify({ addresses }),
      UID: uid,
      httpStatusCodes: true,
      apiKey: GIGYA_KEY,
      secret: GIGYA_SECRET,
    },
  })

const fetchSetAddress = req => {
  const toSave = get(['body', pickAddressFields(Date.now())], req)

  return fetchAddresses(req.body.uid)
    .then(
      get([
        ifElse(
          get([elems, when(address => address.atgId === toSave.atgId)]),
          set([elems, when(address => address.atgId === toSave.atgId)], toSave),
          addresses => [...addresses, toSave]
        ),
      ])
    )
    .then(addresses => saveAddresses({ uid: req.body.uid, addresses }))
}

/**
 * Save/Update an Address in Gigya
 *
 * 1) Get current addresses
 * 2) If an atgId is sent, replace the current one with same atgId
 *    If no current one with same atgId is found, throw an error
 * 3) If no atgId is sent, generate one and push the address into the array
 *
 * @param req
 * @returns {Promise<addresses[]>}
 */
exports.setShippingAddress = (req, res) =>
  fetchSetAddress(req)
    .then(result => res.status(result.status).json(result.data))
    .catch(error => console.log(error) || res.status(error.code || 500).json(error.error || error))
