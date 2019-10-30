const axios = require('axios')
const { Nothing, Maybe, get } = require('pratica')
const { GIGYA_KEY } = require('../config')
const { getLang, handleAxios } = require('../shared')
const {
  publishNewAccountEvent
} = require('./publish-new-account-event/publish-new-account-event')
const { searchByEmail } = require('./search-by-email')
const { linkDummyAccount } = require('./link-dummy-account')

// Refer to https://developers.gigya.com/display/GD/accounts.initRegistration+REST
// Returns a `regToken` to be used in further steps
const initRegistration = () =>
  axios
    .get('https://accounts.us1.gigya.com/accounts.initRegistration', {
      headers: {
        'Accept-Encoding': 'gzip',
        'Content-Encoding': 'gzip',
      },
      params: {
        httpStatusCodes: true,
        apiKey: GIGYA_KEY
      },
    })
    .then(...handleAxios)

// https://developers.gigya.com/display/GD/accounts.register+REST
// Can return a new `regToken`
const register = ({ email, password, lang, regToken }) =>
  axios
    .get('https://accounts.us1.gigya.com/accounts.register', {
      headers: {
        'Accept-Encoding': 'gzip',
        'Content-Encoding': 'gzip',
      },
      params: {
        email,
        password,
        lang,
        regToken,
        httpStatusCodes: true,
        finalizeRegistration: true,
        apiKey: GIGYA_KEY
      },
    })
    .then(...handleAxios)

// emailExists :: error -> boolean
const emailExists = error =>
  error.errorCode === 400009 &&
  error.validationErrors.filter(
    x => (x.errorCode === 400003) & (x.fieldName === 'email')
  ).length === 1

// canLinkAccountUID :: HttpResponse -> Maybe
const canLinkAccountUID = response =>
  Maybe(response)
    .chain(get(['results', 0]))
    .chain(data =>
      get(['data', 'isDummyPassword'])(data).chain(pass => !pass ? Nothing : get(['UID'])(data))
    )

const signup = (req, res) => {
  const { email, password, hasAgreedTerms, banner, source } = req.body
  // we signup to newsletter based on the language
  const lang = getLang(req.query.lang)

  return initRegistration()
    .then(({ regToken }) => register({ email, password, lang, regToken }))
    .then(result =>
      publishNewAccountEvent({
        email,
        uid: result.UID,
        banner,
        source,
        lang,
        hasAgreedTerms
      })
        .then(() => result)
        // even if Google Pub/Sub fails (very unlikely), keep going
        .catch(err => console.log(err) || result)
    )
    .then(result => res.json(result))
    .catch(({ code, error }) =>
      emailExists(error)
        ? searchByEmail(email)
          .then(response => canLinkAccountUID(response).cata({
              Just: uid => linkDummyAccount({ UID: uid, password, hasAgreedTerms }),
              Nothing: () => Promise.reject({ code: 409, error: 'User already exists' })
            })
          )
          .then(result => res.json(result))
        : res.status(code).json(error)
    )
    .catch(({ code, error }) => res.status(code).json(error))
}

exports.signup = signup
exports.canLinkAccountUID = canLinkAccountUID
exports.emailExists = emailExists