const { get } = require('axios')
const { pickAll } = require('ramda')
const { fetchAddresses } = require('./get-addresses')
const { handleAxios } = require('../shared')
const { elems, when, set } = require('partial.lenses')
const { GIGYA_KEY, GIGYA_SECRET } = require('../config')

const addressFields = [
  'atgId',
  'alias',
  'firstName',
  'lastName',
  'country',
  'zipcode',
]

const requiredAddressFields = [
  'alias',
  'firstName',
  'lastName',
  'country',
  'zipcode',
]

// address' atgId has the format "a<unix>", e.g. "a1526400192322"
const generateAtgId = () => `a${Date.now() / 1000}`

const validateRequiredFields = address =>
  new Promise((resolve, reject) => {
    requiredAddressFields.forEach(rf => address[rf] || reject({ code: 400, message: `address.${rf} is required` }))
    resolve()
  })

const saveAddresses = ({ uid, addresses }) =>
  get('https://accounts.us1.gigya.com/accounts.setAccountInfo',
    {
      params: {
        data: JSON.stringify({ addresses }),
        UID: uid,
        httpStatusCodes: true,
        apiKey: GIGYA_KEY,
        secret: GIGYA_SECRET,
      },
    })
    .then(...handleAxios)

const fetchSetAddress = req => {
  // keep only the fields we want
  const toSave = pickAll(addressFields, req.body.address)
  toSave.atgId = toSave.atgId || generateAtgId()

  return (
    validateRequiredFields(toSave)
      .then(() => fetchAddresses(req.body.uid))
      .then(addresses => ({ addresses, index: addresses.findIndex(address => toSave.atgId == address.atgId)}))
      .then(({ addresses, index }) => index==-1 ? [...addresses, toSave] : set([elems, when(x => x.atgId === toSave.atgId)], toSave, addresses)) 
      .then(addresses => saveAddresses({ uid: req.body.uid, addresses }))
      // if everything goes well, return the newly saved address
      .then(() => toSave)
  )
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
exports.setAddress = (req, res) =>
  fetchSetAddress(req)
    .then(result => res.json(result))
    .catch(({ code, error }) => res.status(code || 500).json(error))

exports.fetchSetAddress = fetchSetAddress
