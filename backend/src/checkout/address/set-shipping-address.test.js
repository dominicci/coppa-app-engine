const { generateAtgId, addresses, pickAddressFields } = require('./set-shipping-address')
const { get } = require('partial.lenses')

const fixture = {
  addressOne: '2050 Rue Mansfield',
  addressTwo: '',
  city: 'Montreal',
  country: 'CA',
  firstName: 'test',
  lastName: 'test',
  phone: '5555555555',
  state: 'QC',
  uid: 'e036c597ec9444d7985d3f7cca91f460',
  zipcode: 'H3A 1Y9',
}

const formattedAddress = {
  addressOne: '2050 Rue Mansfield',
  addressTwo: '',
  city: 'Montreal',
  country: 'CA',
  firstName: 'test',
  lastName: 'test',
  phone: '5555555555',
  state: 'QC',
  zipcode: 'H3A 1Y9',
  alias: 'Default',
  atgId: 'a1565803389.581',
}

describe('Serverless - Set Shipping Address for user in GIGYA', () => {
  it('Function : PickAddressFields should format incoming response to address object', () => {
    fixture['atgId'] = 'a1565803389.581'
    const data = get([pickAddressFields(Date.now())], fixture)

    expect(data).toEqual(formattedAddress)
  })

  it('Function : PickAddressFields should format incoming response to address object with a newly generated atgId', () => {
    const data = get([pickAddressFields(Date.now())], fixture)
    formattedAddress.atgId = data.atgId

    expect(data).toEqual(formattedAddress)
  })

  it('Function : generateAtgId should generate a valid ATG id', () => {
    const isVaidId = /^a[0-9]{10}.[0-9]+$/
    expect(isVaidId.test(generateAtgId(Date.now()))).toEqual(true)
  })

  it('Function : addresses should return the addresses object from incoming response', () => {
    const data = get(addresses, { data: { data: { addresses: fixture } } })
    expect(data).toEqual(fixture)
  })

  it('Function : addresses should default to empty array if no address present in incoming response', () => {
    const data = get(addresses, { data: { data: {} } })
    expect(data).toEqual([])
  })
})
