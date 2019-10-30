const { intersection } = require('ramda')
const { get, filter, elems, foldl, defaults } = require('partial.lenses')

const defaultRes = {
  badges: { ids: [], seen: true },
  coupons: { ids: [], seen: true },
}

// clean :: Notifications -> Notifications
const clean = notifications => Object.assign({}, notifications)

// extract :: Nullable GigyaNotifications -> Notifications
const extract = get([defaults(defaultRes), clean])

// extractCouponIds :: Coupons -> Array String
const extractCouponIds = foldl((xs, x) => [...xs, x.id], [], elems)

// extractBadgeIds :: Array Badge -> Array String
const extractBadgeIds = foldl((xs, x) => [...xs, x.badgeId], [], elems)

// aCouponIds :: Array Coupon -> Array String
const couponIds = get([filter(x => x.available), extractCouponIds, defaults([])])

// aBadgeIds :: Array Badge -> Array String
const badgeIds = get([filter(x => x.earned), extractBadgeIds, defaults([])])

// transform :: Array HttpResponse -> UserData
const transform = ([nots, coups, badges]) => ({
  notifications: extract(nots),
  couponIds: couponIds(coups['ca']),
  badgeIds: badgeIds(badges),
})

// badgeEqualsCheck :: HttpResponse -> Array String
const badgeEqualsCheck = res =>
  res.badgeIds === res.notifications.badges.ids ? res.notifications.badges.ids : res.badgeIds

// badgeSeenCheck :: HttpResponse -> Boolean
const badgeSeenCheck = res =>
  intersection(res.badgeIds)(res.notifications.badges.ids).length === res.badgeIds.length &&
  intersection(res.badgeIds)(res.notifications.badges.ids).length === res.notifications.badges.ids.length
    ? res.notifications.badges.seen
    : false

// couponsEqualsCheck :: HttpResponse -> Array String
const couponsEqualsCheck = res =>
  res.couponIds === res.notifications.coupons.ids ? res.notifications.coupons.ids : res.couponIds

// couponsEqualsCheck :: HttpResponse -> Boolean
const couponsSeenCheck = res =>
  intersection(res.couponIds)(res.notifications.coupons.ids).length === res.couponIds.length &&
  intersection(res.couponIds)(res.notifications.coupons.ids).length === res.notifications.coupons.ids.length
    ? res.notifications.coupons.seen
    : false

// notifications :: UserData -> Notifications
const notifications = userData => ({
  badges: {
    seen: badgeSeenCheck(userData),
    ids: badgeEqualsCheck(userData),
  },
  coupons: {
    seen: couponsSeenCheck(userData),
    ids: couponsEqualsCheck(userData),
  },
})

// getNotifications :: Array HttpRequest -> Notification
exports.getNotifications = get([transform, notifications])
