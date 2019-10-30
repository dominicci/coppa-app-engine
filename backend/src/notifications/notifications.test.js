const responseFixture = require('./fixtures/notifications-response.fixture.json')
const responseFixture2 = require('./fixtures/notifications-response2.fixture.json')
const { getNotifications } = require('./get-notifications')

const getNotificationsResponse = {
  badges: {
    seen: false,
    ids: ['buildprofile', 'buy2ways'],
  },
  coupons: {
    seen: false,
    ids: ['284a2876-7945-11e8-ba83-0acde2fb4dd6', '284a2876-7945-22e6-ba83-0acde2fb4dd6'],
  },
}

const getNotificationsResponse2 = {
  badges: {
    seen: true,
    ids: ['buildprofile', 'buy2ways', 'spend200'],
  },
  coupons: {
    seen: true,
    ids: [
      '284a2876-7945-11e8-ba83-0acde2fb4dd6',
      '284a2876-7945-22e6-ba83-0acde2fb4dd6',
      '284a2877-7945-33e6-ba83-0hike2fb4dd6',
    ],
  },
}

describe('Serverless - Notifications', () => {
  it('Function getNotifications; 1st Use case: Notifications vs Badges & Offers changed. Should return notifications', () => {
    expect(getNotifications(responseFixture)).toEqual(getNotificationsResponse)
  })
  it('Function getNotifications; 2nd Use case. Notifications vs Badges & Offers unchanged. Should return notifications', () => {
    expect(getNotifications(responseFixture2)).toEqual(getNotificationsResponse2)
  })
})
