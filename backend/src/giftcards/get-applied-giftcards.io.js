const axios = require('axios')
const { tryP } = require('fluture')

const getAppliedGiftCardsRequest = ({
  headers: { cookie },
  body: { siteId }
}) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/CheckoutFacade/getAppliedGiftCards?siteId=${siteId}`,
      method: 'POST',
      headers: {
        Cookie: `${cookie}`
      }
    })
  ).map(({ data }) => data)

// getAppliedGiftCards :: (HttpRequest, HttpResponse) -> Cancel
exports.getAppliedGiftCards = (req, res) =>
  getAppliedGiftCardsRequest(req).fork(
    () => res.status(500).json('Unexpected error'),
    data => res.json(data)
  )
