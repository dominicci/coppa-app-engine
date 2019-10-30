const { get } = require('axios')
const { tryP, parallel } = require('fluture')
const { GIGYA_KEY, GIGYA_SECRET } = require('../config')
const { getNotifications } = require('./get-notifications')
const { userCouponsReq } = require('../loyalty/coupons/user-coupons')
const { userStatusReq } = require('../loyalty/status/user-status')
const { handleAxios } = require('../shared')

// userCoupons :: HttpRequest -> Future
const userCoupons = req =>
  tryP(() => userCouponsReq(req))
    .mapRej(err => ({ code: err.statusCode, msg: err.errorMessage }))

// userStatus :: HttpRequest -> Future
const userStatus = req =>
  tryP(() => userStatusReq(req))
    .mapRej(err => ({ code: err.statusCode, msg: err.errorMessage }))

// fetch :: HttpRequest -> Future
const fetch = req =>
  tryP(() =>
    get('https://accounts.us1.gigya.com/accounts.getAccountInfo', {
      params: {
        UID: req.query.uid,
        httpStatusCodes: true,
        apiKey: GIGYA_KEY,
        secret: GIGYA_SECRET,
      },
    })
      .then(...handleAxios)
  )
    .mapRej(err => ({ code: err.statusCode, msg: err.errorMessage }))

// getNotificationsIo :: (HttpRequest, HttpResponse) -> Cancel
exports.getNotificationsIo = (req, res) =>
  parallel(Infinity, [fetch(req), userCoupons(req), userStatus(req)]).fork(
    ({ code, error }) => res.status(code).json(error),
    ([notifications, coupons, status]) => res.json(getNotifications([notifications.data.notifications, coupons, status.badges])))
