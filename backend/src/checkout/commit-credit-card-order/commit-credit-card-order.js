const { get, pick } = require('partial.lenses')

const formatCreditCardOrder = get([
  pick({
    paymentType: ['paymentType', x => x && x.toUpperCase()],
    responseQueryString: 'responseQueryString',
    ecommType: 'ecommType',
  }),
])

module.exports = {
  formatCreditCardOrder,
}
