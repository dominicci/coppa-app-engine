const { canLinkAccountUID, emailExists } = require('./signup')

const emailSearchResponse1 = {
  results: [
    {
      UID: 'f31454c715f1425a9054f1721c2dda95',
      data: {
        isDummyPassword: true
      }
    }
  ]
}

const emailSearchResponse2 = {
  results: [
    {
      UID: 'f31454c715f1425a9054f1721c2dda95',
      data: {
        isDummyPassword: false
      }
    }
  ]
}

const error1 = {
  error: {
    errorCode: 400009,
    validationErrors: [
      {
        errorCode: 400003,
        fieldName: 'email'
      }
    ]
  }
}
const error2 = {
  error: {
    errorCode: 400009,
    validationErrors: [
      {
        errorCode: 400003,
        fieldName: 'name'
      }
    ]
  }
}

describe('Signup Functions', () => {
  it('Function canLinkAccountUID; isDummyPassword is equal to true, return the UID', () => {
    expect(
      canLinkAccountUID(emailSearchResponse1).cata({
        Just: uid => uid,
        Nothing: () => false
      })
    ).toEqual('f31454c715f1425a9054f1721c2dda95')
  })

  it('Function canLinkAccountUID; isDummyPassword is equal to false, returns false', () => {
    expect(
      canLinkAccountUID(emailSearchResponse2).cata({
        Just: uid => uid,
        Nothing: () => false
      })
    ).toEqual(false)
  })

  it('Function emailExists; register response returns true', () => {
    expect(emailExists(error1.error)).toEqual(true)
  })

  it('Function emailExists; register response returns false', () => {
    expect(emailExists(error2.error)).toEqual(false)
  })
})
