const { get, pick, defaults } = require('partial.lenses')

// address' atgId has the format "a<unix>", e.g. "a1526400192322"
const generateAtgId = date => `a${date / 1000}`

const addresses = get(['data', 'data', 'addresses', defaults([])])

const pickAddressFields = date => pick({
  alias: get(['alias', defaults('Default')]),
  atgId: get(['atgId', defaults(generateAtgId(date))]),
  firstName: 'firstName',
  lastName: 'lastName',
  addressOne: 'addressOne',
  addressTwo: get(['addressTwo', defaults('')]),
  zipcode: 'zipcode',
  city: 'city',
  state: 'state',
  phone: 'phone',
  country: 'country',
})

module.exports = {
  generateAtgId,
  addresses,
  pickAddressFields,
}
