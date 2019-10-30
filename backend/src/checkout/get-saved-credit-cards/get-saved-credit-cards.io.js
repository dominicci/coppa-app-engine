const axios = require('axios')
const { tryP } = require('fluture')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const getSavedCreditCardsRequest = ({ headers: { cookie } }) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/ProfileFacade/getSavedCreditCards`,
      method: 'POST',
      headers: {
        Cookie: `${cookie}`
      }
    })
  ).map(res => unlockCookieForDevelopment(res))

// getSavedCreditCards :: (HttpRequest, HttpResponse) -> Cancel
exports.getSavedCreditCards = (req, res) =>
  getSavedCreditCardsRequest(req).fork(
    err => console.log(err) || res.status(500).json('Unexpected error'),
    ({ cookies, data }) => 
      res.set('Set-Cookie', cookies)
        .status( data.errors ? 401 : 200)
        .json(data)
  )
