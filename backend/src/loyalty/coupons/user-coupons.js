const { get } = require('axios')
const { merge, omit, prop, sortBy } = require('ramda')
const { GALE_URL } = require('../../config')
const { enOrFr, handleAxios } = require('../../shared')

const locales = ['ca', 'us', 'fr-ca']
const formatPrettyExpires = locale => coupon => merge(coupon, { prettyExpires: dateFormatters[enOrFr(locale)](coupon) })
const expiresToDates = coupon => merge(coupon, { dateExpires: new Date(coupon.expires) })
const omitExpiresToDates = coupon => omit(['dateExpires'], coupon)
const sortByExpires = coupons => sortBy(prop('expires'))(coupons)

const dateFormatters = {
  en: c => `${months_en[c.dateExpires.getMonth()]} ${c.dateExpires.getUTCDate()}, ${c.dateExpires.getFullYear()}`,
  fr: c => `${c.dateExpires.getUTCDate()} ${months_fr[c.dateExpires.getMonth()]} ${c.dateExpires.getFullYear()}`,
}

const months_en = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
}

const months_fr = {
  0: 'janvier',
  1: 'février',
  2: 'mars',
  3: 'avril',
  4: 'mai',
  5: 'juin',
  6: 'juillet',
  7: 'août',
  8: 'septembre',
  9: 'octobre',
  10: 'novembre',
  11: 'décembre',
}

const getCoupons = locale => uid =>
  get(`${GALE_URL}/GDILoyalty/v1.0/${enOrFr(locale)}/user/${uid}/couponlist`)
    .then(...handleAxios)

const userCouponsReq = req =>
  locales.reduce(
    (accP, locale) => accP.then(acc =>
      getCoupons(locale)(req.query.uid)
        .then(({ coupons }) => coupons)
        .then(coupons => coupons.filter(coupon => coupon.available))
        .then(coupons => coupons.map(expiresToDates))
        .then(coupons => coupons.map(formatPrettyExpires(locale)))
        .then(sortByExpires)
        .then(coupons => coupons.map(omitExpiresToDates))
        .then(coupons => merge(acc, { [locale]: coupons }))
    ),
    Promise.resolve()
  )

/**
 * Returns user's coupons
 *
 * @param uid
 */
exports.userCoupons = (req, res) =>
  userCouponsReq(req)
    .then(result => res.json(result))
    .catch(({ code, error }) => res.status(code || 500).json(error))

exports.userCouponsReq = userCouponsReq
