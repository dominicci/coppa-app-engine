const { ALGOLIA_PRODUCT_INDEX } = require('../config')

const localeIndexSuffixMap = {
  ca: '_en_ca',
  'fr-ca': '_fr_ca',
  us: '_en_us',
}

const localeRegionMap = {
  ca: 'CA',
  'fr-ca': 'CA',
  us: 'US',
}

// getSearchIndex :: String -> String
const getSearchIndex = locale => `${ALGOLIA_PRODUCT_INDEX}${localeIndexSuffixMap[locale]}`

// formatURL :: HTTPRequestBodyParams -> String
// using the prod URL for recommended products. QA url is out of data and we will  not renew it
const formatURL = params =>
  `https://gdi-loyaltyengine-lb-prod.galepartners.com/GDILoyalty/v1.0/recommendations/${params.product_id}/${params.brand}/${localeRegionMap[params.locale]}/${
    params.user_id ? params.user_id : ''
  }?format=json`

// formatData :: GaleRecommendations -> Recommendations
const formatData = data =>
  data.status === 'OK'
    ? { status: data.status, recommended: data.recommended, trending: data.trending, code: 200 }
    : data.error.code === 500
      ? { status: data.status, error: data.error, code: 500 }
      : { status: data.status, error: data.error, code: 400 }

// formatForAlgolia :: Products[] -> Products[]
const formatForAlgolia = data =>
  data.recommended.concat(data.trending).sort((a, b) => (a.score < b.score ? 1 : b.score < a.score ? -1 : 0))

// formatAlgoliaFilter :: Products[] -> String
const formatAlgoliaFilter = data =>
  formatForAlgolia(data)
    .reduce((a, c) => a.concat([`styleNumber:'${c.styleId}'`], [`id:'${c.styleId}'`]), [])
    .join(' OR ')

// formatAlgoliaFilter :: Map String String -> Product[] -> AlgoliaQuery
const createAlgoliaRequestQuery = params => data => [
  {
    query: '',
    indexName: getSearchIndex(params.locale),
    params: {
      filters: formatAlgoliaFilter(data),
    },
  },
]

// styleScoreMap :: Products[] -> Scores
const styleScoreMap = items =>
  items.recommended.concat(items.trending).reduce((a, c) => Object.assign({ [c.styleId]: c.score }, a), {})

// formatAlgoliaData :: Scores -> Products[] -> Products[]
const formatAlgoliaData = items => data =>
  data.results[0].hits
    .reduce((a, c) => a.concat(Object.assign({ score: items[c.styleNumber] || items[c.id] }, c)), [])
    .reduce((a, c) => (c.skus.length ? a.concat(c) : a), [])
    .sort((a, b) => (a.score < b.score ? 1 : b.score < a.score ? -1 : 0))
    .slice(0, 5)

module.exports = {
  formatURL,
  formatData,
  formatForAlgolia,
  createAlgoliaRequestQuery,
  formatAlgoliaFilter,
  formatAlgoliaData,
  getSearchIndex,
  styleScoreMap,
}
