const axios = require('axios')
const Memcached = require('memcached') //https://github.com/3rd-Eden/memcached#readme
const { collect, entries, modify, elems, set } = require('partial.lenses')
const {
  FF_OMNI,
  INVENTORY_VIEW_CA,
  INVENTORY_VIEW_US,
  INVENTORY_API_URL,
  INVENTORY_MEMCACHE_URL,
} = require('../config')

const memcached = new Memcached(INVENTORY_MEMCACHE_URL, {
  poolSize: 1000, // the maximum size of the connection pool.
  timeout: 2000, // the time after which Memcached sends a connection timeout (milliseconds).
  retries: 0, // the number of socket allocation retries per request.
  failures: 0, // the number of failed-attempts to a server before it is regarded as 'dead'.
})

// formatMemcacheResult :: RawMemcache -> [{ itemId: String, availability: number, stockQty: number}]
const formatMemcacheResult = collect([
  entries,
  ([key, v]) => [key, JSON.parse(v)],
  ([key, v]) => ({
    itemId: key.match(/(\d+)_.+/)[1],
    availability: v.availability,
    stockQty: v.stockQty,
  }),
])

const requestMemcache = payload =>
  new Promise((resolve, reject) => {
    memcached.getMulti(payload, (err, data) => (err ? reject(err) : resolve(data)))
  })
    .then(formatMemcacheResult)
    .then(data => ({ data, source: 'memcache' }))

const requestInventoryAPI = (itemIds, viewName) =>
  axios({
    url: INVENTORY_API_URL,
    method: 'POST',
    data: {
      itemIds,
      viewName,
    },
  }).then(({ data }) => ({ data, source: 'API' }))

const getInventoryRequest = ({ body: { itemIds, locale } }) => {
  const viewName = locale === 'en-US' || locale === 'us' ? INVENTORY_VIEW_US : INVENTORY_VIEW_CA
  const memcachePayload = modify(elems, id => `${id}_${viewName}`)(itemIds)

  return requestMemcache(memcachePayload)
    .catch(err => console.error('Memcache failed, error:', err) || requestInventoryAPI(itemIds, viewName))
    .then(set('view', viewName))
}

// getInventory :: (HttpRequest, HttpResponse) -> Cancel
exports.getInventory = (req, res) =>
  FF_OMNI
    ? getInventoryRequest(req)
        .then(({ data, source, view }) => res.status(200).json({ skus: data, omniFlag: true, source, view }))
        .catch(err => console.error(err) || res.status(500).json({ error: err, omniFlag: true, skus: [] }))
    : res.status(200).json({ skus: [], omniFlag: false })
