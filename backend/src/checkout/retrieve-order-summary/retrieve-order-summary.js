const { get, pick, defaults, collect, elems, add, identity } = require('partial.lenses')

// TODO: Fill with actuall available stock
const availableStock = 11

const cartImageString = color => id =>
  `//storage.googleapis.com/share-gdicdn/images/product/${id}/${id}_${color}_274x410.jpg`

const getStyleId = item => (item.productId.match('prod') ? get('originalStyleId', item) : get('productId', item))

// Eventually we will be getting available stock for each item, so this object will be unique to each product.
const numAvailable = collect([
  x => Array(x - 1).keys(),
  Array.from,
  elems,
  add(1),
  pick({
    key: identity,
    text: identity,
    value: identity,
  }),
])(availableStock)

const formatCartItems = collect([
  elems,
  item => ({
    ...item,
    numAvailable,
    image: cartImageString(item.color)(getStyleId(item)),
  }),
])

const formatCartData = get([
  pick({
    cartItems: get(['items', defaults([]), formatCartItems]),
    closenessQualifiers: 'closenessQualifiers',
    couponsOnProfile: get(['couponsOnProfile', defaults([])]),
    currencyCode: 'currencyCode',
    customerMessage: 'customerMessage',
    gift: 'gift',
    giftCardsAmount: get(['giftCardsAmount', defaults(0)]),
    orderNumber: 'orderNumber',
    orderRemainingBalance: get(['orderRemainingBalance', val => Number(val || 0).toFixed(2)]),
    orderTaxes: get([
      'orderTaxes',
      defaults([]),
      taxes => taxes.map(tax => ({ ...tax, amount: Number(tax.amount || 0).toFixed(2) })),
    ]),
    orderTotalAmount: get(['orderTotal', val => Number(val || 0).toFixed(2)]),
    orderDiscounts: get(['orderDiscount', val => Number(val || 0).toFixed(2)]),
    paymentDetails: get(['paymentDetails', defaults([])]),
    promoDiscounts: get(['promoDiscount', val => Number(val || 0).toFixed(2)]),
    promotions: 'promotions',
    shipToStoreId: 'shipToStoreId',
    shippingAddress: 'shippingAddress',
    shippingAmount: get(['shippingAmount', val => Number(val || 0).toFixed(2)]),
    freeShipping: get(['shippingAmount', val => val === 0]),
    shippingDiscount: get(['shippingDiscount', val => Number(val || 0).toFixed(2)]),
    shippingMethod: 'shippingMethod',
    subtotal: get(['subtotal', val => Number(val || 0).toFixed(2)]),
    success: 'success',
    errors: 'errors',
    anonymousUser: 'anonymousUser',
  }),
])

module.exports = {
  formatCartData,
}
