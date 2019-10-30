const { get } = require('axios')
const { GIGYA_KEY, GIGYA_SECRET, DUMMY_PASSWORD } = require('../config')
const { handleAxios } = require('../shared')

exports.linkDummyAccount = ({ UID, password, hasAgreedTerms }) =>
  get('https://accounts.us1.gigya.com/accounts.setAccountInfo',
    {
      params: {
        UID: UID,
        newPassword: password,
        password: DUMMY_PASSWORD,
        data: JSON.stringify({
          isDummyPassword: false,
          terms: !!hasAgreedTerms,
          loyalty: { hasAgreed: !!hasAgreedTerms }
        }),
        httpStatusCodes: true,
        apiKey: GIGYA_KEY,
        secret: GIGYA_SECRET
      },
    })
    .then(...handleAxios)
