const { get } = require('axios')
const { tryP } = require('fluture')
const { GALE_URL } = require('../config')
const { handleAxios } = require('../shared')

// userWebhookReq :: String -> Future
const userWebhookReq = uid =>
  tryP(() =>
    get(`${GALE_URL}/GDILoyalty/v1.0/user/${uid}/webhook/`, { params: { format: 'json' } })
      .then(...handleAxios)
  )

exports.userWebhookReq = userWebhookReq
