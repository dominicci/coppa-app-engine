const { formatAddressData } = require('./edit-shipping-address')

const fixture = {
  siteId: 'dynamiteSiteCA',
  addressOne: '585 Rue Shakespeare',
  addressTwo: null,
  alias: 'Default',
  atgId: 'a1552922986590',
  city: 'Dollard des ormeaux',
  country: 'CA',
  firstName: 'Mike',
  lastName: 'D',
  phone: '(514) 778-7798',
  state: 'QC',
  uid: 'd338100a59a04a968488f2d9a4cdd61e',
  zipcode: 'H9G 1A6',
}

const formattedData = {
  firstName: 'Mike',
  lastName: 'D',
  address1: '585 Rue Shakespeare',
  address2: null,
  city: 'Dollard des ormeaux',
  country: 'CA',
  state: 'QC',
  postalCode: 'H9G 1A6',
  phoneNumber: '(514) 778-7798',
  gift: false,
  userMessage: '',
}

describe('Serverless - Edit Cart Summary gets request data from client. The fields names need to be mapped to names expected by ATG', () => {
  it('Function : formatAddressData should format the incomming request to what the API expects', () => {
    const data = formatAddressData(fixture)
    expect(data).toEqual(formattedData)
  })
})
