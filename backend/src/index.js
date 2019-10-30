const config = require('./config')
const { getStyleSurvey } = require('./style-survey/get-style-survey.io')
const { postStyleSurvey } = require('./style-survey/post-style-survey.io')
const { upgradeAccount } = require('./upgrade-account/upgrade-account.io')
const { getNotificationsIo } = require('./notifications/get-notifications.io')
const { postNotifications } = require('./notifications/post-notifications.io')
const { getAddresses } = require('./address/get-addresses')
const { setAddress } = require('./address/set-address')
const { signup } = require('./signup/signup')
const { handleNewAccountEventSpam } = require('./signup/handle-new-account-spam/handle-new-account-spam')
const { getQuickProfile } = require('./quick-profile/get-quick-profile')
const { setQuickProfile } = require('./quick-profile/set-quick-profile')
const { userStatus } = require('./loyalty/status/user-status')
const { userCoupons } = require('./loyalty/coupons/user-coupons')
const { search } = require('./search/search')
const { joinNewsletter } = require('./newsletter/newsletter.io')
const { postTermsAndConditions } = require('./loyalty/termsandconditions/post-terms-and-conditions.io')
const { recommended } = require('./recommended/recommended.io')
const { userWebhook } = require('./gale/user-webhook.io')
const { retrieveOrderSummary } = require('./checkout/retrieve-order-summary/retrieve-order-summary.io')
const { orderInventoryLookup } = require('./checkout/order-inventory-lookup/order-inventory-lookup.io')
const { duplicateOrderValidation } = require('./checkout/duplicate-order-validation/duplicate-order-validation.io')
const { editShippingAddress } = require('./checkout/edit-shipping-address/edit-shipping-address.io')
const { getShippingMethod } = require('./checkout/get-shipping-method/get-shipping-method.io')
const { setShippingMethod } = require('./checkout/set-shipping-method/set-shipping-method.io')
const { getAppliedGiftCards } = require('./giftcards/get-applied-giftcards.io')
const { getGiftCardBalance } = require('./giftcards/get-giftcard-balance.io')
const { applyGiftCardToOrder } = require('./giftcards/apply-giftcard-to-order.io')
const { removeGiftCardFromOrder } = require('./giftcards/remove-giftcard-from-order.io')
const {
  createOrderToOptimalPayment,
} = require('./checkout/create-order-to-optimal-payment/create-order-to-optimal-payment.io')
const { addSavedCreditCard } = require('./checkout/add-saved-credit-card/add-saved-credit-card.io')
const { getSavedCreditCards } = require('./checkout/get-saved-credit-cards/get-saved-credit-cards.io')
const { moveToConfirmation } = require('./checkout/move-to-confirmation/move-to-confirmation.io')
const { commitCreditCardOrder } = require('./checkout/commit-credit-card-order/commit-credit-card-order.io')
const { verifyAddress } = require('./checkout/verify-address/verify-address.io')
const { setShippingAddress } = require('./checkout/address/set-shipping-address.io')
const { retrieveCartSummary } = require('./checkout/retrieve-cart-summary/retrieve-cart-summary.io')
const { updateItemQuantity } = require('./checkout/update-item-quantity/update-item-quantity.io')
const { removeItemFromOrder } = require('./checkout/remove-item-from-order/remove-item-from-order.io')
const { setBillingAddress } = require('./checkout/set-billing-address/set-billing-address.io')
const { getGooglePlaces } = require('./checkout/get-google-places/get-google-places.io')
const { getStoreLocations } = require('./checkout/get-store-locations/get-store-locations.io')
const { setShipToStore } = require('./checkout/set-ship-to-store/set-ship-to-store.io')
const { getOrderHistory } = require('./checkout/get-order-history/get-order-history.io')
const { addToCart } = require('./checkout/add-to-cart/add-to-cart.io')
const { addGiftCardToCart } = require('./checkout/add-giftcard-to-cart/add-giftcard-to-cart.io')
const { removeCreditCard } = require('./checkout/remove-credit-card/remove-credit-card.io')
const { getInventory } = require('./omni/get-inventory.io')

module.exports = {
  title: 'Dynamite API Docs.',
  description: 'API Docs for all dynamite cloud functions',
  base: `https://us-east1-digital-xyz.cloudfunctions.net/${config.BRAND_CODE}-${config.STAGE}-`,
  endpoints: [
    {
      name: 'style-survey',
      display: 'Style Survey',
      description: "Retrieve and modify user's style survey data in Gigya",
      handlers: {
        GET: {
          requiredQueryParams: [
            {
              name: 'uid',
              description: 'Gigya User ID',
              type: 'String',
            },
          ],
          responses: [
            {
              code: 200,
              model: 'StyleSurvey',
            },
            {
              code: 400,
              model: 'Error',
            },
            {
              code: 405,
              model: 'Error',
            },
          ],
          handler: getStyleSurvey,
        },
        POST: {
          requiredBodyParams: [
            {
              name: 'uid',
              description: 'Gigya User ID',
              type: 'String',
            },
            {
              name: 'styleSurvey',
              description: 'Style Survey Object',
              type: 'Object',
            },
          ],
          handler: postStyleSurvey,
        },
      },
    },
    {
      name: 'upgrade-account',
      display: 'Upgrade Account',
      description: 'Upgrade a user to loyalty status',
      handlers: {
        GET: {
          requiredQueryParams: [
            {
              name: 'hasAgreedTerms',
              description: 'Has the user agreed to the Terms and Conditions?',
            },
            {
              name: 'banner',
            },
            {
              name: 'lang',
            },
            {
              name: 'uid',
            },
          ],
          handler: upgradeAccount,
        },
      },
    },
    {
      name: 'notifications',
      display: 'Notifications',
      description: "Get and Set user's notifications",
      handlers: {
        GET: {
          requiredQueryParams: [
            {
              name: 'banner',
            },
            {
              name: 'lang',
            },
            {
              name: 'uid',
            },
          ],
          handler: getNotificationsIo,
        },
        POST: {
          requiredBodyParams: [
            {
              name: 'uid',
            },
            {
              name: 'notifications',
            },
          ],
          handler: postNotifications,
        },
      },
    },
    {
      name: 'signup',
      display: 'Signup',
      description: 'Create an account for a user',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'hasAgreedTerms',
            },
          ],
          handler: signup,
        },
      },
    },
    {
      name: 'handle-new-account-spam',
      display: 'Handle New Account Spam',
      description: 'Pub/Sub event',
      handlers: {
        EVENT: {
          handler: handleNewAccountEventSpam,
        },
      },
    },
    {
      name: 'addresses',
      display: 'Addresses',
      description: 'Save / Edit user addresses',
      handlers: {
        GET: {
          requiredQueryParams: [{ name: 'uid' }],
          handler: getAddresses,
        },
        POST: {
          requiredBodyParams: [{ name: 'uid' }, { name: 'address' }],
          handler: setAddress,
        },
      },
    },
    {
      name: 'quick-profile',
      display: 'Quick Profile',
      description: "Get and Set a user's quick profile",
      handlers: {
        GET: {
          requiredQueryParams: [{ name: 'uid' }],
          handler: getQuickProfile,
        },
        POST: {
          requiredBodyParams: [{ name: 'uid' }, { name: 'profile' }],
          handler: setQuickProfile,
        },
      },
    },
    {
      name: 'loyalty-user-status',
      display: 'Loyalty User Status',
      description: "Get a user's status",
      handlers: {
        GET: {
          requiredQueryParams: [{ name: 'uid' }],
          handler: userStatus,
        },
      },
    },
    {
      name: 'loyalty-user-coupons',
      display: 'Loyalty User Coupons',
      description: "Get a user's offers / coupons",
      handlers: {
        GET: {
          requiredQueryParams: [{ name: 'uid' }],
          handler: userCoupons,
        },
      },
    },
    {
      name: 'search',
      display: 'Search',
      description: 'Search products with a query',
      handlers: {
        GET: {
          requiredHeaders: [{ name: 'cookie', description: 'Cookies including the JSESSIONID' }],
          optionalQueryParams: [{ name: 'q', description: 'A search term' }],
          handler: search,
        },
      },
    },
    {
      name: 'join-newsletter',
      display: 'Join Newsletter',
      description: 'Sign a user up for the newsletter',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'email',
            },
            {
              name: 'source',
            },
            {
              name: 'banner',
            },
          ],
          handler: joinNewsletter,
        },
      },
    },
    {
      name: 'termsandconditions',
      display: 'Terms and conditions',
      description: "Set the user's loyalty 1.1 terms and conditions acceptance status",
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'uid',
            },
            {
              name: 'hasAgreedLoyalty11Terms',
              type: 'String',
              description: 'The date on which the user has agreed to the Loyalty 1.1 Terms and Conditions',
            },
          ],
          handler: postTermsAndConditions,
        },
      },
    },
    {
      name: 'recommended',
      display: 'Recommended Products',
      description: 'Get recommended products from Gale',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'product_id',
              description: 'Product id. This is also the style number in ATG.',
              type: 'String',
            },
            {
              name: 'brand',
              description: 'dynamite or garage',
              type: 'String',
            },
            {
              name: 'locale',
              description: 'ca, fr-ca, or us',
              type: 'String',
            },
          ],
          optionalBodyParams: [
            {
              name: 'user_id',
              description: 'Gigya user id',
              type: 'String',
            },
          ],
          handler: recommended,
        },
      },
    },
    {
      name: 'user-webhook',
      display: 'Gale User Webhook',
      description: 'User Webhook triggers Gale to check for updates on users account in GIGYA',
      handlers: {
        GET: {
          requiredQueryParams: [{ name: 'uid', type: 'String', description: 'Gigya User ID' }],
          handler: userWebhook,
        },
      },
    },
    {
      name: 'retrieve-order-summary',
      display: 'Retrieve Order Summary',
      description: 'Retrieve a users order summary',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'siteId',
              type: 'String',
              description: 'The site id [dynamiteSiteCA|dynamiteSiteUS|garageSiteCA|garageSiteUS]',
            },
          ],
          handler: retrieveOrderSummary,
        },
      },
    },
    {
      name: 'order-inventory-lookup',
      display: 'Order Inventory Lookup',
      description: 'Inventory Lookup. Requires authenticated user to forward cookies.',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'siteId',
              type: 'String',
              description: 'The site id [dynamiteSiteCA|dynamiteSiteUS|garageSiteCA|garageSiteUS]',
            },
          ],
          handler: orderInventoryLookup,
        },
      },
    },
    {
      name: 'duplicate-order-validation',
      display: 'Duplicate Order Validation',
      description: 'Duplicate order validation. Requires an authenitcated user to forward cookies.',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'siteId',
              type: 'String',
              description: 'The site id [dynamiteSiteCA|dynamiteSiteUS|garageSiteCA|garageSiteUS]',
            },
          ],
          handler: duplicateOrderValidation,
        },
      },
    },
    {
      name: 'edit-shipping-address',
      display: 'Edit Shipping Address',
      description:
        'Edit / Confirm shipping address at checkout. Set if gift, also add message if gift. \
      Requires an authenticated user to forward cookies. Also gift(bool), userMessage(string) and address2(string) are all optional',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'siteId',
              type: 'String',
              description: 'The site id [dynamiteSiteCA|dynamiteSiteUS|garageSiteCA|garageSiteUS]',
            },
            {
              name: 'firstName',
              type: 'String',
              description: 'First name',
            },
            {
              name: 'lastName',
              type: 'String',
              description: 'Last name',
            },
            {
              name: 'addressOne',
              type: 'String',
              description: 'Address',
            },
            {
              name: 'city',
              type: 'String',
              description: 'City',
            },
            {
              name: 'country',
              type: 'String',
              description: 'Country. Eg: CA, US',
            },
            {
              name: 'state',
              type: 'String',
              description: 'State or Province Eg. QC',
            },
            {
              name: 'zipcode',
              type: 'String',
              description: 'Postal Code or Zipcode',
            },
            {
              name: 'phone',
              type: 'String',
              description: 'Phone Number Format: (438)555-3636',
            },
          ],
          handler: editShippingAddress,
        },
      },
    },
    {
      name: 'get-shipping-method',
      display: 'Get Shipping Methods',
      description: 'Get shipping methods. Requires an authenticated user to forward cookies.',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'siteId',
              type: 'String',
              description: 'The site id [dynamiteSiteCA|dynamiteSiteUS|garageSiteCA|garageSiteUS]',
            },
            {
              name: 'country',
              type: 'String',
              description: 'Country CA or US',
            },
            {
              name: 'postalCode',
              type: 'String',
              description: 'postal code or zipcode',
            },
          ],
          handler: getShippingMethod,
        },
      },
    },
    {
      name: 'set-shipping-method',
      display: 'Set Shipping Methods',
      description: 'Set shipping method. Requires authenticated user to forward cookies.',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'siteId',
              type: 'String',
              description: 'The site id [dynamiteSiteCA|dynamiteSiteUS|garageSiteCA|garageSiteUS]',
            },
            {
              name: 'shippingMethodId',
              type: 'String',
              description: 'Shipping method ID, a Value returned from getShippingMethods',
            },
          ],
          handler: setShippingMethod,
        },
      },
    },
    {
      name: 'get-applied-giftcards',
      display: 'Get Applied Gift Cards',
      description: 'Get Applied Gift Cards. Requires authenticated user to forward cookies.',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'siteId',
              type: 'String',
              description: 'The site id [dynamiteSiteCA|dynamiteSiteUS|garageSiteCA|garageSiteUS]',
            },
          ],
          handler: getAppliedGiftCards,
        },
      },
    },
    {
      name: 'get-giftcard-balance',
      display: 'Get Gift Card Balance',
      description: 'Get Gift Card Balance. Requires authenticated user to forward cookies.',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'siteId',
              type: 'String',
              description: 'The site id [dynamiteSiteCA|dynamiteSiteUS|garageSiteCA|garageSiteUS]',
            },
            {
              name: 'cardNumber',
              type: 'String',
              description: 'The gift card number',
            },
            {
              name: 'securityCode',
              type: 'String',
              description: 'Security code for the gift card',
            },
          ],
          handler: getGiftCardBalance,
        },
      },
    },
    {
      name: 'apply-giftcard-to-order',
      display: 'Apply Gift Card To Order',
      description: 'Apply gift card to order. Requires authenticated user to forward cookies.',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'siteId',
              type: 'String',
              description: 'The site id [dynamiteSiteCA|dynamiteSiteUS|garageSiteCA|garageSiteUS]',
            },
            {
              name: 'cardNumber',
              type: 'String',
              description: 'The gift card number',
            },
            {
              name: 'securityCode',
              type: 'String',
              description: 'Security code for the gift card',
            },
          ],
          handler: applyGiftCardToOrder,
        },
      },
    },
    {
      name: 'remove-giftcard-from-order',
      display: 'Remove Gift Card From Order',
      description: 'Remove gift card from order. Requires authenticated user to forward cookies.',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'siteId',
              type: 'String',
              description: 'The site id [dynamiteSiteCA|dynamiteSiteUS|garageSiteCA|garageSiteUS]',
            },
            {
              name: 'cardNumber',
              type: 'String',
              description: 'The gift card number',
            },
            {
              name: 'paymentGroupId',
              type: 'String',
              description: 'The payment group Id corresponding to the giftcard',
            },
          ],
          handler: removeGiftCardFromOrder,
        },
      },
    },
    {
      name: 'create-order-to-optimal-payment',
      display: 'Create Order To Optimal Payment',
      description:
        'Creates the order in Paysafe, returns us a post URL to send Credit Card information. Implies we are using a new Credit Card. Requires an authenitcated user to forward cookies',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'firstName',
              type: 'String',
              description: 'First name',
            },
            {
              name: 'lastName',
              type: 'String',
              description: 'Last name',
            },
            {
              name: 'address1',
              type: 'String',
              description: 'Address 1',
            },
            {
              name: 'address2',
              type: 'String',
              description: 'Address 2',
            },
            {
              name: 'city',
              type: 'String',
              description: 'City',
            },
            {
              name: 'country',
              type: 'String',
              description: 'Country. Eg: CA, US',
            },
            {
              name: 'state',
              type: 'String',
              description: 'State or Province Eg. QC',
            },
            {
              name: 'postalCode',
              type: 'String',
              description: 'Postal Code or Zipcode',
            },
            {
              name: 'phoneNumber',
              type: 'String',
              description: 'Phone Number Format: (438)555-3636',
            },
          ],
          handler: createOrderToOptimalPayment,
        },
      },
    },
    {
      name: 'add-saved-credit-card',
      display: 'Add Saved Credit Card',
      description: 'Add Saved Credit Card',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'queryParams',
              type: 'String',
              description: 'pay.netbanx.com returns opResponseQueryString. I think this goes here.',
            },
          ],
          handler: addSavedCreditCard,
        },
      },
    },
    {
      name: 'get-saved-credit-cards',
      display: 'Get Saved Credit Cards',
      description: 'Get Saved Credit Cards. Requires an authenticated user to forward cookies.',
      handlers: {
        POST: {
          requiredBodyParams: [],
          handler: getSavedCreditCards,
        },
      },
    },
    {
      name: 'move-to-confirmation',
      display: 'Move To Confirmation',
      description:
        'Move To Confirmation implies that we are using a users existing credit card to checkout. \
      This is a 2 step call that first does a setSite request to ATG. The header cookies returned from ATG are used in the 2nd request. \
      Creates the order in Paysafe, returns us a post URL.',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'siteId',
              type: 'String',
              description: 'The site id [dynamiteSiteCA|dynamiteSiteUS|garageSiteCA|garageSiteUS]',
            },
            {
              name: 'paymentType',
              type: 'String',
              description: 'One of CREDITCARD, INTERAC or PAYPAL',
            },
            {
              name: 'orderId',
              type: 'String',
              description: 'The users current order ID',
            },
            {
              name: 'creditCardCvdNumber',
              type: 'String',
              description: '',
            },
            {
              name: 'saveCreditCard',
              type: 'Boolean',
              description: 'Save the credit card',
            },
            {
              name: 'savedCreditCardId',
              type: 'String',
              description: 'Id of the saved credit card to use',
            },
            {
              name: 'firstName',
              type: 'String',
              description: 'First name',
            },
            {
              name: 'lastName',
              type: 'String',
              description: 'Last name',
            },
            {
              name: 'address1',
              type: 'String',
              description: 'Address 1',
            },
            {
              name: 'address2',
              type: 'String',
              description: 'Address 2',
            },
            {
              name: 'city',
              type: 'String',
              description: 'City',
            },
            {
              name: 'country',
              type: 'String',
              description: 'Country. Eg: CA, US',
            },
            {
              name: 'state',
              type: 'String',
              description: 'State or Province Eg. QC',
            },
            {
              name: 'postalCode',
              type: 'String',
              description: 'Postal Code or Zipcode',
            },
            {
              name: 'phoneNumber',
              type: 'String',
              description: 'Phone Number Format: (438)555-3636',
            },
          ],
          handler: moveToConfirmation,
        },
      },
    },
    {
      name: 'commit-credit-card-order',
      display: 'Commit Credit Card Order',
      description:
        'Commit Credit Card Order, requires response data from Paysafe. Requires and authenticated user to forward cookies',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'paymentType',
              type: 'String',
              description: 'One of CREDITCARD, ONLINE or GIFTCARD. Online groups interact and paypal payments.',
            },
          ],
          handler: commitCreditCardOrder,
        },
      },
    },
    {
      name: 'verify-address',
      display: 'Verify Address',
      description: 'Verify Shipping Address',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'addressOne',
              type: 'String',
              description: 'Street Address',
            },
            {
              name: 'city',
              type: 'String',
              description: 'City',
            },
            {
              name: 'state',
              type: 'String',
              description: 'Province or State',
            },
            {
              name: 'zipcode',
              type: 'String',
              description: 'Postal code or zip',
            },
            {
              name: 'country',
              type: 'String',
              description: 'CA or US',
            },
          ],
          handler: verifyAddress,
        },
      },
    },
    {
      name: 'set-shipping-address',
      display: 'Set Shipping Address',
      description: 'Set Shipping Address',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'uid',
              type: 'String',
              description: 'Unique user identifier',
            },
            {
              name: 'firstName',
              type: 'String',
              description: 'First name',
            },
            {
              name: 'lastName',
              type: 'String',
              description: 'Last name',
            },
            {
              name: 'addressOne',
              type: 'String',
              description: 'Street Address',
            },
            {
              name: 'city',
              type: 'String',
              description: 'City',
            },
            {
              name: 'state',
              type: 'String',
              description: 'Province or State',
            },
            {
              name: 'zipcode',
              type: 'String',
              description: 'Postal code or zip',
            },
            {
              name: 'country',
              type: 'String',
              description: 'CA or US',
            },
            {
              name: 'phone',
              type: 'String',
              description: 'Phone number',
            },
          ],
          handler: setShippingAddress,
        },
      },
    },
    {
      name: 'retrieve-cart-summary',
      display: 'Retrieve Cart Summary',
      description: 'This request Syncs HIVE bag with ATG and returns the cart items in detail',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'siteId',
              type: 'String',
              description: 'The site id [dynamiteSiteCA|dynamiteSiteUS|garageSiteCA|garageSiteUS]',
            },
          ],
          handler: retrieveCartSummary,
        },
      },
    },
    {
      name: 'update-item-quantity',
      display: 'Update Item Quantity in Cart',
      description: 'Update Item Quantity in an existing ATG bag.',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'siteId',
              type: 'String',
              description: 'The site id [dynamiteSiteCA|dynamiteSiteUS|garageSiteCA|garageSiteUS]',
            },
            {
              name: 'skuId',
              type: 'String',
              description: 'The sku id',
            },
            {
              name: 'commerceItemId',
              type: 'String',
              description: 'The commerceItem id',
            },
            {
              name: 'quantity',
              type: 'String',
              description: 'Quantity to add to cart. Number cannot be less than or equal to 0',
            },
          ],
          handler: updateItemQuantity,
        },
      },
    },
    {
      name: 'get-google-places',
      display: 'Retrieve Place suggestions',
      description: 'This request return place suggestions from Google maps api with text as input',
      handlers: {
        POST: {
          requiredBodyParams: [{ name: 'requestType' }],
          handler: getGooglePlaces,
        },
      },
    },
    {
      name: 'get-store-locations',
      display: 'Get store locations',
      description: 'Get store locations for ship to store.',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'radius',
              type: 'String',
              description: 'Fetch stores within this radius',
            },
            {
              name: 'latitude',
              type: 'String',
              description: 'Latitude of location selected by user',
            },
            {
              name: 'longitude',
              type: 'String',
              description: 'Longitude of location selected by user',
            },
            {
              name: 'locale',
              type: 'String',
              description: 'Locale to calculate distance in km/miles',
            },
          ],
          handler: getStoreLocations,
        },
      },
    },
    {
      name: 'get-inventory',
      display: 'Get Inventory',
      description: 'Get inventory for all skus on pdp.',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'itemIds',
              type: 'Array[String]',
              description: 'List of sku ids',
            },
            {
              name: 'locale',
              type: 'String',
              description: 'locale value',
            },
          ],
          handler: getInventory,
        },
      },
    },
    {
      name: 'remove-item-from-order',
      display: 'Remove Item from Order',
      description: 'Remove Item from Order in an existing ATG bag.',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'commerceItemId',
              type: 'String',
              description: 'The commerce item id',
            },
          ],
          handler: removeItemFromOrder,
        },
      },
    },
    {
      name: 'set-billing-address',
      display: 'Set Billing Address',
      description: 'Set Billing Address',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'firstName',
              type: 'String',
              description: 'First name',
            },
            {
              name: 'lastName',
              type: 'String',
              description: 'Last name',
            },
            {
              name: 'addressOne',
              type: 'String',
              description: 'Street Address',
            },
            {
              name: 'city',
              type: 'String',
              description: 'City',
            },
            {
              name: 'state',
              type: 'String',
              description: 'Province or State',
            },
            {
              name: 'zipcode',
              type: 'String',
              description: 'Postal code or zip',
            },
            {
              name: 'country',
              type: 'String',
              description: 'CA or US',
            },
            {
              name: 'phone',
              type: 'String',
              description: 'Phone number',
            },
          ],
          handler: setBillingAddress,
        },
      },
    },
    {
      name: 'set-ship-to-store',
      display: 'Set Ship To Store',
      description: 'Set the order on ATG to Ship to Store',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'storeId',
              type: 'String',
              description: 'A store ID returned by our homegrown stores API',
            },
            {
              name: 'pickupFirstName',
              type: 'String',
              description: 'The name of the person who will pick up the package in the store',
            },
            {
              name: 'pickupFirstName',
              type: 'String',
              description: 'The given name of the person who will pick up the package in the store',
            },
            {
              name: 'pickupLastName',
              type: 'String',
              description: 'The last name of the person who will pick up the package in the store',
            },
            {
              name: 'siteId',
              type: 'String',
              description: 'dynamiteSiteCA or dynamiteSiteUS',
            },
          ],
          handler: setShipToStore,
        },
      },
    },
    {
      name: 'get-order-history',
      display: 'Get Order History',
      description: 'Get order history. Get all user order history.',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'siteId',
              type: 'String',
              description: 'The site id [dynamiteSiteCA|dynamiteSiteUS|garageSiteCA|garageSiteUS]',
            },
          ],
          handler: getOrderHistory,
        },
      },
    },
    {
      name: 'add-to-cart',
      display: 'Add To Cart',
      description: 'Add item to order.',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'skuId',
              type: 'String',
              description: 'The sku id',
            },
            {
              name: 'productId',
              type: 'String',
              description: 'The product id',
            },
            {
              name: 'multipleSuppliers',
              type: 'String',
              description: 'If the product has multiple suppliers. False by default.',
            },
            {
              name: 'quantity',
              type: 'String',
              description: 'Quantity of items to add to cart.',
            },
          ],
          handler: addToCart,
        },
      },
    },
    {
      name: 'add-giftcard-to-cart',
      display: 'Add Gift Card To Cart',
      description: 'Add Gift card to order.',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'quantity',
              type: 'String',
              description: 'Quantity of gift cards to add to cart.',
            },
            {
              name: 'giftCardAmount',
              type: 'String',
              description: 'Amount of the gift card. ',
            },
            {
              name: 'electronic',
              type: 'String',
              description: 'Is an electronic gift card?',
            },
            {
              name: 'giftCardMessage',
              type: 'String',
              description: 'Gift card message',
            },
            {
              name: 'giftCardRecipient',
              type: 'String',
              description: 'Recipient email address',
            },
            {
              name: 'giftCardSender',
              type: 'String',
              description: 'Sender email address',
            },
          ],
          handler: addGiftCardToCart,
        },
      },
    },
    {
      name: 'remove-credit-card',
      display: 'Remove Credit Card',
      description: 'Remove saved credit card from credit card list.',
      handlers: {
        POST: {
          requiredBodyParams: [
            {
              name: 'key',
              type: 'String',
              description: 'Key of the credit card to remove',
            },
          ],
          handler: removeCreditCard,
        },
      },
    },
  ],
  models: {
    StyleSurvey: {
      data: {
        style_survey: {
          q1: {
            a1: 'Boolean',
            a2: 'Boolean',
            a3: 'Boolean',
          },
          q2: {
            a1: 'Boolean',
            a2: 'Boolean',
            a3: 'Boolean',
          },
          q3: {
            q1: {
              a1: 'Boolean',
              a2: 'Boolean',
            },
            q2: {
              a1: 'Boolean',
              a2: 'Boolean',
            },
            q3: {
              a1: 'Boolean',
              a2: 'Boolean',
            },
          },
        },
      },
    },
    Error: {
      code: 'Number',
      error: 'String',
    },
  },
}
