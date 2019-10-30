const { tryP, of } = require('fluture')
const { get, collect, elems } = require('partial.lenses')
const { GCLOUD_PROJECT_ID, FIRESTORE_ENVIRONMENT_ID, FIND_IN_STORE_API_URL } = require('../../config')
const { sortWeekdays, appendQty } = require('./get-store-locations')
const axios = require('axios')

const WEEK = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const getStoreLocationsRequest = ({
  headers: { cookie },
  body: { radius, latitude, longitude, locale, brand, shipToStore = false },
}) =>
  tryP(() =>
    axios({
      url: `https://us-east1-${GCLOUD_PROJECT_ID}.cloudfunctions.net/gdi-stores-${FIRESTORE_ENVIRONMENT_ID}-getStoresByCoordinates`,
      method: 'POST',
      headers: {
        cookie,
      },
      data: {
        radius: radius,
        latitude: latitude,
        longitude: longitude,
        locale: locale,
        brand: brand,
        shipToStore: shipToStore,
      },
    })
  ).map(({ data }) => data.map(store => sortWeekdays(store, WEEK)))

// getStoreStock :: String[] -> String -> Future
const getStoreStock = storeIds => skuId =>
  tryP(() =>
    axios({
      url: FIND_IN_STORE_API_URL,
      method: 'POST',
      data: {
        itemIds: [skuId],
        locationIds: storeIds,
        viewName: 'FindInStore',
      },
    })
  ).map(({ data }) => data)

const fetchStoreData = req => {
  const skuId = get(['body', 'skuId'], req)
  return getStoreLocationsRequest(req).chain(data =>
    skuId ? getStoreStock(collect([elems, 'id'], data))(skuId).map(stocks => appendQty(stocks)(data)) : of(data)
  )
}

// getStoreLocations :: (HttpRequest, HttpResponse) -> Cancel
exports.getStoreLocations = (req, res) =>
  fetchStoreData(req).fork(() => res.status(500).json('Unexpected error'), data => res.json(data))
