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
    currencyCode: get(['currencyCode', defaults('')]),
    cartItems: get(['cartItems', defaults([]), formatCartItems]),
    closenessQualifiers: 'closenessQualifiers',
    couponsOnProfile: get(['couponsOnProfile', defaults([])]),
    orderDiscounts: get(['orderDiscount', defaults(0)]),
    orderRemainingBalance: get(['orderRemainingBalance', val => Number(val || 0).toFixed(2)]),
    orderTotalAmount: get(['orderTotalAmount', val => Number(val || 0).toFixed(2)]),
    promoDiscounts: get(['promoDiscount', val => Number(val || 0).toFixed(2)]),
    shippingAmount: get(['shippingAmount', val => Number(val || 0).toFixed(2)]),
    shippingDiscounts: get(['shippingDiscounts', defaults([])]),
    shippingMethod: 'shippingMethod',
    subtotal: get(['subtotal', val => Number(val || 0).toFixed(2)]),
    orderTaxes: get([
      'orderTaxes',
      defaults([]),
      taxes => taxes.map(tax => ({ ...tax, amount: Number(tax.amount || 0).toFixed(2) })),
    ]),
    success: 'success',
    errors: 'errors',
  }),
])

module.exports = {
  formatCartData,
}
