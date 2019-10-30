const axios = require('axios')
const { clamp, filter, merge, pipe, propEq, sum, is } = require('ramda')
const { GALE_URL } = require('../../config')
const { enOrFr, handleAxios } = require('../../shared')
const { isBadgeLoyalty11 } = require('../loyalty11Helpers')

// helpers
const clamp0100 = p => clamp(0, 100, p)
const normalizePercent = percent => pipe(clamp0100, Math.floor)(percent)

// requirements percents
const getProgressPercentage = ({ target, progress }) => normalizePercent(progress / target * 100)
const getOverallProgressPercentage = reqs => normalizePercent(sum(reqs.map(r => r.progressPercentage)) / reqs.length)

// vip percents
const netSpendRemainderPercent = n => (n % 200) / 200 * 100
const getVipProgressPercentage = netSpend => pipe(netSpendRemainderPercent, normalizePercent)(netSpend)

// badges
const getBadgesEarned = badges => filter(propEq('earned', true), badges).length
const getBadgesEarnedPercentage = badges => normalizePercent(getBadgesEarned(badges) / badges.length * 100)

// badge order
const badgeOrder = ['buildprofile', 'buy2ways', 'spend200', 'spend500'] 

// Check vip property. Legacy returns object, Loyalty1.1 returns boolean
const isFip = vip => is(Object, vip) ? propEq('earned', true)(vip) : vip

const userStatusReq = req =>
  axios
    .get(`${GALE_URL}/GDILoyalty/v1.0/${enOrFr(req.query.lang)}/user/${req.query.uid}/status/`)
    .then(...handleAxios)
    .then(data =>
      merge(data, {
        fip: isFip(data.vip),
        // percentage for next VIP 25% Off coupon
        vip: merge(data.vip, {
          netSpendPercentage: getVipProgressPercentage(data.netSpend),
        }),
        badges: data.badges
          // filter out non-loyalty 1.1 badges
          .filter(isBadgeLoyalty11)
          // sort badge order
          .sort((a,b) => badgeOrder.indexOf(a.badgeId) - badgeOrder.indexOf(b.badgeId))
          // add progressPercentage to badges requirements
          .map(badge =>
            merge(badge, {
              requirements: badge.requirements.map(req =>
                merge(req, {
                  progressPercentage: getProgressPercentage(req),
                })
              ),
            })
          )
          // add overall progressPercentage to badges
          .map(badge =>
            merge(badge, {
              progressPercentage: getOverallProgressPercentage(badge.requirements),
            })
          ),
      })
    )
    .then(data =>
      merge(data, {
        badgesEarned: getBadgesEarned(data.badges),
        badgesEarnedPercentage: getBadgesEarnedPercentage(data.badges),
      })
    )

/**
 * Returns user's badges/vip status
 *
 * @param uid
 * @param lang {fr, en}
 */
exports.userStatus = (req, res) =>
  userStatusReq(req)
    .then(result => res.json(result))
    .catch(({ code, error }) => res.status(code).json(error))

exports.userStatusReq = userStatusReq
