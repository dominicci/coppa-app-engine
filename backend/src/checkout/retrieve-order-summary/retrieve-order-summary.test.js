const { formatCartData } = require('./retrieve-order-summary')

const fixture = {
  closenessQualifiers: [],
  couponsOnProfile: [],
  currencyCode: 'CAD',
  customerMessage: null,
  errors: null,
  gift: false,
  giftCardsAmount: 0,
  items: [
    {
      brand: 'Dynamite',
      color: '03G',
      colorDescription: 'Snow White',
      commerceItemId: 'ci2561000116',
      donation: false,
      electronicGiftCard: false,
      finalPrice: 29.95,
      finalSale: false,
      itemDiscount: 0,
      length: null,
      listPrice: 29.95,
      message: null,
      name: 'Twist Back Top ',
      onSale: false,
      originalStyleId: null,
      physicalGiftCard: false,
      productId: '100047315',
      promotion: [],
      quantity: 1,
      recipient: null,
      recipientEmail: null,
      salePrice: 29.95,
      size: 'M',
      skuId: '0524559',
    },
    {
      brand: 'Garage',
      color: '14T',
      colorDescription: 'Doeskin',
      commerceItemId: 'ci2563000094',
      donation: false,
      electronicGiftCard: false,
      finalPrice: 24.95,
      finalSale: false,
      itemDiscount: 0,
      length: null,
      listPrice: 24.95,
      message: null,
      name: 'Bungee Strap Bodycon Dress',
      onSale: false,
      originalStyleId: '100048735',
      physicalGiftCard: false,
      productId: 'prod3610020',
      promotion: [],
      quantity: 1,
      recipient: null,
      recipientEmail: null,
      salePrice: 24.95,
      size: 'XS',
      skuId: '0529908',
    },
    {
      brand: 'Garage',
      color: '07I',
      colorDescription: 'Surf City Blue ',
      commerceItemId: 'ci2563000095',
      donation: false,
      electronicGiftCard: false,
      finalPrice: 59.95,
      finalSale: false,
      itemDiscount: 0,
      length: null,
      listPrice: 59.95,
      message: null,
      name: 'Ultra High Rise Jegging ',
      onSale: false,
      originalStyleId: null,
      physicalGiftCard: false,
      productId: '100044136',
      promotion: [],
      quantity: 1,
      recipient: null,
      recipientEmail: null,
      salePrice: 59.95,
      size: '1',
      skuId: '0525197',
    },
    {
      brand: 'Garage',
      color: '1MD',
      colorDescription: 'Orange Stripe',
      commerceItemId: 'ci2563000096',
      donation: false,
      electronicGiftCard: false,
      finalPrice: 34.95,
      finalSale: false,
      itemDiscount: 0,
      length: null,
      listPrice: 34.95,
      message: null,
      name: 'Polo Dress ',
      onSale: false,
      originalStyleId: null,
      physicalGiftCard: false,
      productId: '100047849',
      promotion: [],
      quantity: 1,
      recipient: null,
      recipientEmail: null,
      salePrice: 34.95,
      size: 'S',
      skuId: '0517358',
    },
    {
      brand: 'Dynamite',
      color: '04N',
      colorDescription: 'BRIGHT WHITE',
      commerceItemId: 'ci2564000047',
      donation: false,
      electronicGiftCard: false,
      finalPrice: 22.95,
      finalSale: false,
      itemDiscount: 0,
      length: null,
      listPrice: 22.95,
      message: null,
      name: 'Fitted Halter Top',
      onSale: false,
      originalStyleId: '100040832',
      physicalGiftCard: false,
      productId: 'prod3030124',
      promotion: [],
      quantity: 1,
      recipient: null,
      recipientEmail: null,
      salePrice: 22.95,
      size: 'S',
      skuId: '0467876',
    },
    {
      brand: 'Dynamite',
      color: '04N',
      colorDescription: 'Bright White',
      commerceItemId: 'ci2564000048',
      donation: false,
      electronicGiftCard: false,
      finalPrice: 24.95,
      finalSale: false,
      itemDiscount: 0,
      length: null,
      listPrice: 24.95,
      message: null,
      name: 'Ribbed Crew Neck Tank',
      onSale: false,
      originalStyleId: '100047815',
      physicalGiftCard: false,
      productId: 'prod3570038',
      promotion: [],
      quantity: 1,
      recipient: null,
      recipientEmail: null,
      salePrice: 24.95,
      size: 'S',
      skuId: '0528356',
    },
  ],
  orderDiscount: 11,
  orderNumber: 'o188071907',
  orderRemainingBalance: 250.3,
  orderTaxes: [
    {
      amount: '21.72',
      code: 'PST',
    },
    {
      amount: '10.88',
      code: 'GST',
    },
  ],
  orderTotal: 250.3,
  paymentDetails: [],
  promoDiscount: 0,
  promotions: null,
  shipToStoreId: null,
  shippingAddress: {
    address1: '585 Rue Shakespeare',
    address2: null,
    city: 'Dollard des ormeaux',
    country: 'CA',
    firstName: 'Upgrade',
    lastName: 'Account',
    phoneNumber: '(514) 778-7798',
    postalCode: 'H9G 1A6',
    state: 'QC',
  },
  shippingAmount: 20,
  shippingDiscount: 0,
  shippingMethod: 'Express',
  subtotal: 197.7,
  success: true,
}

const formattedData = {
  cartItems: [
    {
      brand: 'Dynamite',
      color: '03G',
      colorDescription: 'Snow White',
      commerceItemId: 'ci2561000116',
      donation: false,
      electronicGiftCard: false,
      finalPrice: 29.95,
      finalSale: false,
      itemDiscount: 0,
      length: null,
      listPrice: 29.95,
      message: null,
      name: 'Twist Back Top ',
      onSale: false,
      originalStyleId: null,
      physicalGiftCard: false,
      productId: '100047315',
      promotion: [],
      quantity: 1,
      recipient: null,
      recipientEmail: null,
      salePrice: 29.95,
      size: 'M',
      skuId: '0524559',
      image: '//storage.googleapis.com/share-gdicdn/images/product/100047315/100047315_03G_274x410.jpg',
      numAvailable: [
        {
          key: 1,
          text: 1,
          value: 1,
        },
        {
          key: 2,
          text: 2,
          value: 2,
        },
        {
          key: 3,
          text: 3,
          value: 3,
        },
        {
          key: 4,
          text: 4,
          value: 4,
        },
        {
          key: 5,
          text: 5,
          value: 5,
        },
        {
          key: 6,
          text: 6,
          value: 6,
        },
        {
          key: 7,
          text: 7,
          value: 7,
        },
        {
          key: 8,
          text: 8,
          value: 8,
        },
        {
          key: 9,
          text: 9,
          value: 9,
        },
        {
          key: 10,
          text: 10,
          value: 10,
        },
      ],
    },
    {
      brand: 'Garage',
      color: '14T',
      colorDescription: 'Doeskin',
      commerceItemId: 'ci2563000094',
      donation: false,
      electronicGiftCard: false,
      finalPrice: 24.95,
      finalSale: false,
      itemDiscount: 0,
      length: null,
      listPrice: 24.95,
      message: null,
      name: 'Bungee Strap Bodycon Dress',
      onSale: false,
      originalStyleId: '100048735',
      physicalGiftCard: false,
      productId: 'prod3610020',
      promotion: [],
      quantity: 1,
      recipient: null,
      recipientEmail: null,
      salePrice: 24.95,
      size: 'XS',
      skuId: '0529908',
      image: '//storage.googleapis.com/share-gdicdn/images/product/100048735/100048735_14T_274x410.jpg',
      numAvailable: [
        {
          key: 1,
          text: 1,
          value: 1,
        },
        {
          key: 2,
          text: 2,
          value: 2,
        },
        {
          key: 3,
          text: 3,
          value: 3,
        },
        {
          key: 4,
          text: 4,
          value: 4,
        },
        {
          key: 5,
          text: 5,
          value: 5,
        },
        {
          key: 6,
          text: 6,
          value: 6,
        },
        {
          key: 7,
          text: 7,
          value: 7,
        },
        {
          key: 8,
          text: 8,
          value: 8,
        },
        {
          key: 9,
          text: 9,
          value: 9,
        },
        {
          key: 10,
          text: 10,
          value: 10,
        },
      ],
    },
    {
      brand: 'Garage',
      color: '07I',
      colorDescription: 'Surf City Blue ',
      commerceItemId: 'ci2563000095',
      donation: false,
      electronicGiftCard: false,
      finalPrice: 59.95,
      finalSale: false,
      itemDiscount: 0,
      length: null,
      listPrice: 59.95,
      message: null,
      name: 'Ultra High Rise Jegging ',
      onSale: false,
      originalStyleId: null,
      physicalGiftCard: false,
      productId: '100044136',
      promotion: [],
      quantity: 1,
      recipient: null,
      recipientEmail: null,
      salePrice: 59.95,
      size: '1',
      skuId: '0525197',
      image: '//storage.googleapis.com/share-gdicdn/images/product/100044136/100044136_07I_274x410.jpg',
      numAvailable: [
        {
          key: 1,
          text: 1,
          value: 1,
        },
        {
          key: 2,
          text: 2,
          value: 2,
        },
        {
          key: 3,
          text: 3,
          value: 3,
        },
        {
          key: 4,
          text: 4,
          value: 4,
        },
        {
          key: 5,
          text: 5,
          value: 5,
        },
        {
          key: 6,
          text: 6,
          value: 6,
        },
        {
          key: 7,
          text: 7,
          value: 7,
        },
        {
          key: 8,
          text: 8,
          value: 8,
        },
        {
          key: 9,
          text: 9,
          value: 9,
        },
        {
          key: 10,
          text: 10,
          value: 10,
        },
      ],
    },
    {
      brand: 'Garage',
      color: '1MD',
      colorDescription: 'Orange Stripe',
      commerceItemId: 'ci2563000096',
      donation: false,
      electronicGiftCard: false,
      finalPrice: 34.95,
      finalSale: false,
      itemDiscount: 0,
      length: null,
      listPrice: 34.95,
      message: null,
      name: 'Polo Dress ',
      onSale: false,
      originalStyleId: null,
      physicalGiftCard: false,
      productId: '100047849',
      promotion: [],
      quantity: 1,
      recipient: null,
      recipientEmail: null,
      salePrice: 34.95,
      size: 'S',
      skuId: '0517358',
      image: '//storage.googleapis.com/share-gdicdn/images/product/100047849/100047849_1MD_274x410.jpg',
      numAvailable: [
        {
          key: 1,
          text: 1,
          value: 1,
        },
        {
          key: 2,
          text: 2,
          value: 2,
        },
        {
          key: 3,
          text: 3,
          value: 3,
        },
        {
          key: 4,
          text: 4,
          value: 4,
        },
        {
          key: 5,
          text: 5,
          value: 5,
        },
        {
          key: 6,
          text: 6,
          value: 6,
        },
        {
          key: 7,
          text: 7,
          value: 7,
        },
        {
          key: 8,
          text: 8,
          value: 8,
        },
        {
          key: 9,
          text: 9,
          value: 9,
        },
        {
          key: 10,
          text: 10,
          value: 10,
        },
      ],
    },
    {
      brand: 'Dynamite',
      color: '04N',
      colorDescription: 'BRIGHT WHITE',
      commerceItemId: 'ci2564000047',
      donation: false,
      electronicGiftCard: false,
      finalPrice: 22.95,
      finalSale: false,
      itemDiscount: 0,
      length: null,
      listPrice: 22.95,
      message: null,
      name: 'Fitted Halter Top',
      onSale: false,
      originalStyleId: '100040832',
      physicalGiftCard: false,
      productId: 'prod3030124',
      promotion: [],
      quantity: 1,
      recipient: null,
      recipientEmail: null,
      salePrice: 22.95,
      size: 'S',
      skuId: '0467876',
      image: '//storage.googleapis.com/share-gdicdn/images/product/100040832/100040832_04N_274x410.jpg',
      numAvailable: [
        {
          key: 1,
          text: 1,
          value: 1,
        },
        {
          key: 2,
          text: 2,
          value: 2,
        },
        {
          key: 3,
          text: 3,
          value: 3,
        },
        {
          key: 4,
          text: 4,
          value: 4,
        },
        {
          key: 5,
          text: 5,
          value: 5,
        },
        {
          key: 6,
          text: 6,
          value: 6,
        },
        {
          key: 7,
          text: 7,
          value: 7,
        },
        {
          key: 8,
          text: 8,
          value: 8,
        },
        {
          key: 9,
          text: 9,
          value: 9,
        },
        {
          key: 10,
          text: 10,
          value: 10,
        },
      ],
    },
    {
      brand: 'Dynamite',
      color: '04N',
      colorDescription: 'Bright White',
      commerceItemId: 'ci2564000048',
      donation: false,
      electronicGiftCard: false,
      finalPrice: 24.95,
      finalSale: false,
      itemDiscount: 0,
      length: null,
      listPrice: 24.95,
      message: null,
      name: 'Ribbed Crew Neck Tank',
      onSale: false,
      originalStyleId: '100047815',
      physicalGiftCard: false,
      productId: 'prod3570038',
      promotion: [],
      quantity: 1,
      recipient: null,
      recipientEmail: null,
      salePrice: 24.95,
      size: 'S',
      skuId: '0528356',
      image: '//storage.googleapis.com/share-gdicdn/images/product/100047815/100047815_04N_274x410.jpg',
      numAvailable: [
        {
          key: 1,
          text: 1,
          value: 1,
        },
        {
          key: 2,
          text: 2,
          value: 2,
        },
        {
          key: 3,
          text: 3,
          value: 3,
        },
        {
          key: 4,
          text: 4,
          value: 4,
        },
        {
          key: 5,
          text: 5,
          value: 5,
        },
        {
          key: 6,
          text: 6,
          value: 6,
        },
        {
          key: 7,
          text: 7,
          value: 7,
        },
        {
          key: 8,
          text: 8,
          value: 8,
        },
        {
          key: 9,
          text: 9,
          value: 9,
        },
        {
          key: 10,
          text: 10,
          value: 10,
        },
      ],
    },
  ],
  closenessQualifiers: [],
  couponsOnProfile: [],
  currencyCode: 'CAD',
  customerMessage: null,
  gift: false,
  giftCardsAmount: 0,
  orderNumber: 'o188071907',
  orderRemainingBalance: '250.30',
  orderTaxes: [
    {
      amount: '21.72',
      code: 'PST',
    },
    {
      amount: '10.88',
      code: 'GST',
    },
  ],
  orderTotalAmount: '250.30',
  orderDiscounts: '11.00',
  paymentDetails: [],
  promoDiscounts: '0.00',
  promotions: null,
  shipToStoreId: null,
  shippingAddress: {
    address1: '585 Rue Shakespeare',
    address2: null,
    city: 'Dollard des ormeaux',
    country: 'CA',
    firstName: 'Upgrade',
    lastName: 'Account',
    phoneNumber: '(514) 778-7798',
    postalCode: 'H9G 1A6',
    state: 'QC',
  },
  shippingAmount: '20.00',
  freeShipping: false,
  shippingDiscount: '0.00',
  shippingMethod: 'Express',
  subtotal: '197.70',
  success: true,
  errors: null,
}

describe('Serverless - Retrieve Order Summary from ATG and format the Data', () => {
  it('Function : formatCartData should format the API reponse', () => {
    const data = formatCartData(fixture)
    expect(data).toEqual(formattedData)
  })
})
