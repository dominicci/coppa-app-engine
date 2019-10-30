const axios = require('axios')
const { tryP } = require('fluture')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const orderInventoryLookupRequest = ({ headers: { cookie }, body: { siteId } }) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/InventoryFacade/orderInventoryLookup`,
      params: {
        siteId,
      },
      method: 'POST',
      headers: {
        Cookie: `${cookie}`,
      },
    })
  ).map(res => unlockCookieForDevelopment(res))

// orderInventoryLookup :: (HttpRequest, HttpResponse) -> Cancel
exports.orderInventoryLookup = (req, res) =>
  orderInventoryLookupRequest(req).fork(
    err => console.log(err) || res.status(500).json('Unexpected error'),
    ({ cookies, data }) => res.set('Set-Cookie', cookies).json(data)
  )
