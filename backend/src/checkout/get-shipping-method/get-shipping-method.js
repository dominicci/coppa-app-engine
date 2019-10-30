const { elems, modify, get, pick, defaults } = require('partial.lenses')

const formatShippingMethods = selectedTitle => modify(elems, current => ({
    ...current,
    displayPrice: get(['shippingPrice', val => (val === 0 ? 'checkout.freeshipping' : Number(val).toFixed(2))], current),
    displayTitle: `${current.title} (${current.deliveryRange})`,
    selected: selectedTitle===current.title
})) 
 
const format = selectedTitle => get(pick({
    success: 'success',
    errors: 'errors',
    shippingMethods: get(['shippingMethods', defaults([]), formatShippingMethods(selectedTitle)])
}))

module.exports = {
    format,
}
