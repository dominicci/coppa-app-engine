const { post } = require('axios')
const { getLang, handleAxios } = require('../shared')
const { DOMAIN } = require('../config')

const joinNewsletterReq = req => {
  const lang = getLang(req.query.lang)
  const cookie = req.headers.cookie
  const email = req.body.email
  const source = req.body.source
  const banner = req.body.banner

  if (!cookie) {
    return Promise.reject('headers.cookie is required')
  }

  const langMap = {
    us: 'en_US',
    ca: 'en_CA',
    'fr-ca': 'fr_CA',
  }

  const body = {
    arg1: {
      class: 'com.gdi.to.services.profile.JoinNewsletterTO',
      email,
      source,
      lang: langMap[lang] || 'en_CA',
      banner: lang === 'us' ? `${banner}-US` : `${banner}-CA`,
    },
  }

  const options = {
    headers: {
      'Content-Type': 'application/json',
      cookie,
    },
  }

  return post(`https://www.${DOMAIN}/rest/bean/gdi/commerce/services/ProfileFacade/joinNewsletter`, body, options)
    .then(...handleAxios)
    .then(result => (result.success ? { status: 200, message: result.success } : {
      code: 401,
      error: result.errors
    }))
}

/**
 *
 * @param req
 *  - query.lang (optional)
 *  - headers.cookie
 *  - body.source
 *  - body.email
 */
exports.joinNewsletter = (req, res) =>
  joinNewsletterReq(req)
    .then(({ status, message }) => res.status(status).json(message))
    .catch(({ code, error }) => res.status(code).json(error))

exports.joinNewsletterReq = joinNewsletterReq
