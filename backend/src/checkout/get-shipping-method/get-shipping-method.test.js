
const { format } = require('./get-shipping-method')
const fixture = {
  errors: null,
  shippingMethods: [
    {
      cpShipMethodCode: 'DOM.RP',
      deliveryRange: '3-10 business days',
      shippingMethodId: '100006',
      shippingPrice: 0,
      surcharge: false,
      title: 'Standard',
    },
    {
      cpShipMethodCode: 'DOM.XP',
      deliveryRange: '2-3 Business Day',
      shippingMethodId: '1800001',
      shippingPrice: 15,
      surcharge: false,
      title: 'Second Day',
    },
    {
      cpShipMethodCode: 'DOM.PC',
      deliveryRange: '1-2 Business Days',
      shippingMethodId: '1900001',
      shippingPrice: 20,
      surcharge: false,
      title: 'Express',
    },
  ],
  success: true,
}

const formattedData = {
  success: true,
  errors: null,
  shippingMethods: [
    {
      cpShipMethodCode: 'DOM.RP',
      deliveryRange: '3-10 business days',
      shippingMethodId: '100006',
      shippingPrice: 0,
      surcharge: false,
      title: 'Standard',
      displayPrice: 'checkout.freeshipping',
      displayTitle: 'Standard (3-10 business days)',
      selected: true,
    },
    {
      cpShipMethodCode: 'DOM.XP',
      deliveryRange: '2-3 Business Day',
      shippingMethodId: '1800001',
      shippingPrice: 15,
      surcharge: false,
      title: 'Second Day',
      displayPrice: '15.00',
      displayTitle: 'Second Day (2-3 Business Day)',
      selected: false,
    },
    {
      cpShipMethodCode: 'DOM.PC',
      deliveryRange: '1-2 Business Days',
      shippingMethodId: '1900001',
      shippingPrice: 20,
      surcharge: false,
      title: 'Express',
      displayPrice: '20.00',
      displayTitle: 'Express (1-2 Business Days)',
      selected: false,
    },
  ],
}

describe('Serverless - Get Shipping Methods for a user from ATG', () => {
    it('Function : format transforms the data for the UI', () => {
      const data = format('Standard')(fixture)
      expect(data).toEqual(formattedData)
    })
  })