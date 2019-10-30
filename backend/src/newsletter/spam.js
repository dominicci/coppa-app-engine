const axios = require('axios')
const { GALE_URL, GIGYA_KEY, GIGYA_SECRET } = require('../config')
const { enOrFr, getLang, getLocale, getBanner, getCountry, handleAxios } = require('../shared')

const getJoinedDate = () => new Date().toISOString()

const getSource = ({ language, bannerCode, source }) =>
  `${bannerCode}_${getCountry(language)}_${enOrFr(language)}_ACC${source ? '_' + source : ''}`

const optIn = () => ({
  isOptedIn: true,
  originalDateJoined: getJoinedDate(),
  dateJoined: getJoinedDate(),
})

const registerToLoyalty = ({ uid, lang }) => axios.put(`${GALE_URL}/GDILoyalty/v1.0/en/user/${uid}/?lang=${lang}`)
  .then(...handleAxios)

/**
 *
 * @param req
 *  - hasAgreedTerms: true|false
 *  - banner: dynamite|garage (defaults to dynamite)
 *  - lang: fr-ca|ca|us (defaults to ca)
 *  - source: e.g. CREATE_DESKTOP_LOY
 *  - UID: obtained from the atgLogin step
 *
 *  Uses https://developers.gigya.com/display/GD/accounts.setAccountInfo+REST
 *  Subscribes user to Loyalty program and to Dynamite/Garage newsletters, LOL
 */
exports.spam = ({ hasAgreedTerms, banner, lang, source, uid }) => {
  const bannerCode = getBanner(banner) === 'dynamite' ? 'DYN' : 'GAR'
  const language = getLang(lang)

  const options = {
    params: {
      data: JSON.stringify({
        addSource: getSource({ language, bannerCode, source }).toUpperCase(),
        email: {
          garage: optIn(),
          dynamite: optIn(),
          loyalty: optIn(),
        },
        terms: !!hasAgreedTerms,
        loyalty: {
          hasAgreed: !!hasAgreedTerms,
          originalDateJoined: getJoinedDate(),
          preferredBrand: getBanner(banner),
          registrationBrand: getBanner(banner),
          preferredCountry: getCountry(language),
          registrationCountry: getCountry(language),
        },
      }),
      profile: JSON.stringify({
        languages: enOrFr(language),
        locale: getLocale(language),
        country: getCountry(language),
      }),
      UID: uid,
      httpStatusCodes: true,
      apiKey: GIGYA_KEY,
      secret: GIGYA_SECRET,
    },
  }

  return axios.get('https://accounts.us1.gigya.com/accounts.setAccountInfo', options)
    .then(...handleAxios)
    .then(() => registerToLoyalty({ uid, lang: enOrFr(language) }))
    .catch(({ code, error }) => console.log(code, error))
}
