const axios = require('axios')
const { tryP } = require('fluture')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const setSiteRequest = ({ headers: { cookie }, body: { userPrefLanguage, siteId } }) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/SiteFacade/setSite`,
      method: 'POST',
      headers: {
        Cookie: `${cookie}`,
      },
      data: {
        arg1: {
          class: 'com.gdi.to.services.profile.SiteTO',
          siteId,
          userPrefLanguage,
        },
      },
    })
  ).map(res => unlockCookieForDevelopment(res))

exports.setSite = (req, res) =>
  setSiteRequest(req).fork(() => 
    res.status(500).json('Unexpected error'), 
    ({ cookies, data }) => 
      res.set('Set-Cookie', cookies)
        .status(data.errors ? 401 : 200)
        .json(data))

exports.setSiteRequest = setSiteRequest
