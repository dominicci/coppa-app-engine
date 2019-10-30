const axios = require('axios')
const { GOOGLE_MAPS_API_KEY } = require('../../config')
const { get, defaults } = require('partial.lenses')
const { tryP } = require('fluture')

const normalize = input => input.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const getPredictedLocationsRequest = input =>
  tryP(() =>
    axios({
      url: `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
      method: 'GET',
      params: {
        input: normalize(input),
        key: GOOGLE_MAPS_API_KEY,
      },
    })
  )
    .map(({ data }) => data)
    .mapRej(err => console.log(err) || e)

const getGeocodeRequest = place_id =>
  tryP(() =>
    axios({
      url: `https://maps.googleapis.com/maps/api/place/details/json`,
      method: 'GET',
      params: {
        place_id,
        fields: 'geometry',
        key: GOOGLE_MAPS_API_KEY,
      },
    })
  )
    .map(({ data }) => get(['result', 'geometry', 'location', defaults({})], data))
    .mapRej(err => console.log(err) || err)

exports.getGooglePlaces = (req, res) =>
  get(['body', 'requestType'], req) === 'geocode'
    ? getGeocodeRequest(req.body.placeId).fork(() => res.status(500).json('Unexpected error'), data => res.json(data))
    : get(['body', 'requestType'], req) === 'location'
    ? getPredictedLocationsRequest(req.body.input).fork(
        () => res.status(500).json('Unexpected error'),
        data => res.json(data)
      )
    : res.status(500).json('Unexpected error')
