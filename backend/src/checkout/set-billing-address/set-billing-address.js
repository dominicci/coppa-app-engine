const { get, pick, defaults } = require('partial.lenses')

const formatAddressData = get([
  pick({
    address1:'addressOne',
    address2: get(['addressTwo', defaults('')]),
    city:'city',
    country:'country',
    firstName:'firstName',
    lastName:'lastName',
    phoneNumber:'phone',
    postalCode:'zipcode',
    state:'state',
  }),
])

module.exports = {
    formatAddressData,
}