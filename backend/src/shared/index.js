const strings = [
  {
    id: 'unknown error',
    us: 'Sorry, an unknown error has occurred.',
    ca: 'Sorry, an unknown error has occurred.',
    'fr-ca': "Désolé, une erreur inconnue s'est produite.",
  },
  {
    id: 'tryAgain',
    us: 'Something went wrong, please try again in a few moments.',
    ca: 'Something went wrong, please try again in a few moments.',
    'fr-ca': 'Une erreur s’est produite. Veuillez réessayer dans quelques instants.',
  },
  {
    id: 'emailpassw incorrect',
    us:
      "Sorry, the email or password you've entered is incorrect. " +
      "Please try again. Can't remember your password? Use the 'forgot your password' option.",
    ca:
      "Sorry, the email or password you've entered is incorrect. " +
      "Please try again. Can't remember your password? Use the 'forgot your password' option.",
    'fr-ca':
      'Désolés, le courriel ou le mot de passe que vous avez entré est incorrect. Veuillez essayer à nouveau. ' +
      "Vous avez oublié votre mot de passe? Utilisez l'option « Mot de passe oublié ».",
  },
  {
    id: 'provide emailpassw',
    us: 'Please provide email and password.',
    ca: 'Please provide email and password.',
    'fr-ca': "S'il vous plaît fournir un email et un mot de passe.",
  },
]

// www is REQUIRED, DO NOT REMOVE, I REPEAT, DO NOT
const baseUrl = 'https://www.dynamiteclothing.com'

const getCountry = lang => (lang && lang.toUpperCase() === 'US' ? 'US' : 'CA')
const enOrFr = lang => (lang && lang.toLowerCase().startsWith('fr') ? 'fr' : 'en')
const getLocale = lang => `${enOrFr(lang)}_${getCountry(lang).toUpperCase()}`

const getString = (id, lang) => strings.filter(item => item.id === id).reduce((prev, cur) => cur[getLang(lang)], '')

const getLang = lang => {
  const whitelist = ['ca', 'fr-ca', 'us']

  if (lang && whitelist.includes(lang.toLowerCase())) {
    return lang.toLowerCase()
  } else {
    return 'ca'
  }
}

const getBanner = banner => {
  const whitelist = ['dynamite', 'garage']

  if (banner && whitelist.includes(banner.toLowerCase())) {
    return banner.toLowerCase()
  } else {
    return 'dynamite'
  }
}

const getStage = () =>
  (process.env.STAGE || 'dev')
    .replace(/\W+/g, '-') // replace all symbols with a dash
    .replace(/-+/g, '-') // replace sequences of dashes by 1 dash
    .replace(/^-|-$/g, '') // remove dashes at start and end
    .toLowerCase() // only lowercases are allowed

const handleAxios = [
  ({ data }) => data,
  ({ response }) => Promise.reject({ code: response.status, error: response.data.error || response.data })
]

module.exports = {
  baseUrl,
  getString,
  getLang,
  getBanner,
  getLocale,
  getCountry,
  getStage,
  enOrFr,
  handleAxios,
}
