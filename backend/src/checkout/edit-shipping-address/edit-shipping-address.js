const { get, pick, defaults } = require('partial.lenses')

const formatAddressData = get([
  pick({
    firstName:'firstName',
    lastName:'lastName',
    address1:'addressOne',
    city:'city',
    country:'country',
    state:'state',
    postalCode:'zipcode',
    phoneNumber:'phone',
    address2: get(['addressTwo', defaults('')]),
    gift: get(['gift', defaults(false)]),
    userMessage: get(['userMessage', defaults('')]),
  }),
])

module.exports = {
    formatAddressData,
}
