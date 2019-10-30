const axios = require('axios')
const { tryP, reject } = require('fluture')
const { formatData, formatURL, createAlgoliaRequestQuery, formatAlgoliaData, styleScoreMap } = require('./recommended')
const { ALGOLIA_APPLICATION_ID, ALGOLIA_SEARCH_ONLY_API_KEY } = require('../config')
const algoliasearch = require('algoliasearch')

const client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_SEARCH_ONLY_API_KEY)

// algoliaSearch :: HTTPRequest -> Products -> Future
const algoliaSearch = req => items =>
  tryP(() => client.search(createAlgoliaRequestQuery(req.body)(items)))
    .map(data => formatAlgoliaData(styleScoreMap(items))(data))
    .mapRej(() => ({
      status: 'ERROR',
      error: {
        code: '500',
        message: 'Could not get recommended products data',
      },
      code: 500,
    }))

// recommendedReq :: HTTPRequest -> Future
const recommendedReq = req =>
  tryP(() =>
    axios.get(formatURL(req.body), {
      validateStatus: status => status < 500,
    })
  )
    .map(({ data }) => formatData(data))
    .chain(data => (data.code === 200 ? algoliaSearch(req)(data) : reject(data)))
    .mapRej(() => ({
      status: 'ERROR',
      error: {
        code: '500',
        message: 'Could not get recommended products data',
      },
      code: 500,
    }))

/**
 *
 * @param req
 *  - body.product_id
 *  - body.brand [Dynamite | Garage]
 *  - body.region [CA | US]
 *  - body.user_id (optional)
 */
exports.recommended = (req, res) =>
  recommendedReq(req).fork(error => res.status(error.code).json(error), data => res.status(200).json(data))
