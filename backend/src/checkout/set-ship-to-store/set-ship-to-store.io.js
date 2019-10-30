const axios = require('axios')
const { tryP } = require('fluture')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const setShipToStoreRequest = ({ headers: { cookie }, body }) =>
  tryP(() => {
    const siteId = body.siteId
    const postData = Object.assign({}, { class: 'com.gdi.to.services.checkout.SetShipToStoreTO' }, body)

    console.log({
        data: {
            arg1: postData,
          }
    })

    return axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/CheckoutFacade/setShipToStore?siteId=${siteId}`,
      method: 'POST',
      headers: {
        Cookie: `${cookie}`,
      },
      data: {
        arg1: postData,
      },
    })
  }).map(res => unlockCookieForDevelopment(res))

// setShipToStore :: (HttpRequest, HttpResponse) -> Cancel
exports.setShipToStore = (req, res) =>
    setShipToStoreRequest(req).fork(
        err => console.log(err) || res.status(500).json('Unexpected error'),
        ({ cookies, data }) =>
        res
            .set('Set-Cookie', cookies)
            .status(200)
            .json(data)
    )
