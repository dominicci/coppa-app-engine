const axios = require('axios')
const xml2json = require('xml2json')
const { Ok, get } = require('pratica')
const { map, pipe } = require('ramda')
const { getLang } = require('../shared')
const { DOMAIN } = require('../config')

const toArray = x => (Array.isArray(x) ? x : [x])

const findByName = name => obj => obj && obj.find(o => o && o.name === name)

const getProp = p => o => o && o[p]

const getItemProperty = get(['Item', 'Property'])

const getListString = pipe(getProp('List'), getProp('String'))

const processResult = result => Ok(result)
  .chain(getItemProperty)
  .map(findByName('productSearchResults'))
  .chain(getItemProperty)
  .map(findByName('records'))
  .chain(get(['List', 'Item']))
  .map(toArray)
  .map(map(getProp('Property')))
  .map(map(findByName('attributes')))
  .map(map(getProp('Item')))
  .map(map(getProp('Property')))
  .map(
    map(p => ({
      url: getListString(findByName('product.finalUrl')(p)),
      text: getListString(findByName('product.displayName')(p)),
      repositoryId: getListString(findByName('product.repositoryId')(p)),
    }))
  )
  .default(() => [])
  .toResult()
  .cata({
    Ok: n => n,
    Err: () => []
  })

const searchReq = req => {
  const lang = getLang(req.query.lang)
  const query = req.query.q

  const options = {
    headers: {
      Accept: 'application/xhtml+xml,application/xml',
      cookie: req.headers.cookie,
    },
    params: {
      format: 'xml',
      Ntt: query,
    },
  }

  // ATG returns results even if we pass an empty query...
  // We return empty array instead, as it's more intuitive
  if (!query) {
    return Promise.resolve([])
  }

  return axios
    .get(`https://www.${DOMAIN}/${lang}/search/type-ahead/type-ahead.jsp`, options)
    .then(({ data }) => data, ({ response }) => Promise.reject(response.data))
    .then(result => xml2json.toJson(result, { object: true }))
    .then(processResult)
}

exports.search = (req, res) =>
  searchReq(req)
    .then(result => res.json(result))
    .catch(error => res.status(500).json({ error }))

exports.searchReq = searchReq
