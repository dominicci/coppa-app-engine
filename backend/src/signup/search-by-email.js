const { get } = require('axios')
const { GIGYA_KEY, GIGYA_SECRET } = require('../config')
const { handleAxios } = require('../shared')

exports.searchByEmail = email =>
  get('https://accounts.us1.gigya.com/accounts.search',
    {
      params: {
        query: `select UID, data.isDummyPassword from accounts where profile.email contains "${email}"`,
        apiKey: GIGYA_KEY,
        secret: GIGYA_SECRET
      }
    })
    .then(...handleAxios)
