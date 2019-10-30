const { get, defaults, ifElse, set, identity, assignTo } = require('partial.lenses')

// verifyParams :: String -> Boolean
const verifyParams = country => ['US', 'CA'].includes(country)

// getParams :: Object -> Object
const getParams = ({ company, addressOne, addressTwo, city, state, zipcode, country }) =>
  get(
    [
      ifElse(() => addressTwo, set('NorthAmericanAddressVerification.AddressLine2', addressTwo), identity),
      ifElse(() => company, set('NorthAmericanAddressVerification.Firm', company), identity),
    ],
    {
      'LicenseInfo.RegisteredUser.UserID': process.env.INFORMATICA_STRIKEIRON_USERID,
      'LicenseInfo.RegisteredUser.Password': process.env.INFORMATICA_STRIKEIRON_PASSWORD,
      'NorthAmericanAddressVerification.AddressLine1': addressOne,
      'NorthAmericanAddressVerification.CityStateOrProvinceZIPOrPostalCode': `${city} ${state} ${zipcode}`,
      'NorthAmericanAddressVerification.Country': country,
      'NorthAmericanAddressVerification.Casing': 'PROPER',
      format: 'JSON',
    }
  )

// filterResponse :: Object -> Object
const filterResponse = ({ data }) =>
  get([
    'WebServiceResponse',
    'NorthAmericanAddressVerificationResponse',
    'NorthAmericanAddressVerificationResult',
    defaults({ error: 'Unexpected API Response', data }),
  ])(data)

// Shipping is not available to Puerto Rico
// isShipping Available :: Object -> Object
const isShippingAvailable = data =>
  get(['ServiceResult', 'USAddress', 'State'], data) === 'PR'
    ? set(assignTo, { ShippingStatus: 'Shipping unavailable' }, get('ServiceStatus', data))
    : data

module.exports = {
  verifyParams,
  getParams,
  filterResponse,
  isShippingAvailable,
}
