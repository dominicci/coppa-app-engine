const { getStage } = require('./shared')

module.exports = {
  STAGE: getStage(),
  BRAND: process.env.BRAND,
  BRAND_CODE: process.env.BRAND_CODE,
  GIGYA_ACCOUNTS_URL: 'https://accounts.us1.gigya.com',
  GIGYA_KEY: process.env.GIGYA_KEY,
  GIGYA_SECRET: process.env.GIGYA_SECRET,
  GIGYA_GET_USER_INFORMATION_URL: 'https://socialize.us1.gigya.com/socialize.getUserInfo',
  GALE_URL: process.env.GALE_URL,
  EXACT_TARGET_CLIENT_ID: process.env.EXACT_TARGET_CLIENT_ID,
  EXACT_TARGET_CLIENT_SECRET: process.env.EXACT_TARGET_CLIENT_SECRET,
  DOMAIN: process.env.DOMAIN || 'dynamiteclothing.com',
  ALGOLIA_APPLICATION_ID: process.env.ALGOLIA_APPLICATION_ID,
  ALGOLIA_SEARCH_ONLY_API_KEY: process.env.ALGOLIA_SEARCH_ONLY_API_KEY,
  ALGOLIA_PRODUCT_INDEX: process.env.ALGOLIA_PRODUCT_INDEX,
  DUMMY_PASSWORD: process.env.DUMMY_PASSWORD,
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  FIRESTORE_ENVIRONMENT_ID: process.env.FIRESTORE_ENVIRONMENT_ID,
  GCLOUD_PROJECT_ID: process.env.GCLOUD_PROJECT_ID,
  FF_OMNI: process.env.FF_OMNI === 'true',
  INVENTORY_VIEW_US: process.env.INVENTORY_VIEW_US,
  INVENTORY_VIEW_CA: process.env.INVENTORY_VIEW_CA,
  FIND_IN_STORE_API_URL: process.env.FIND_IN_STORE_API_URL,
  INVENTORY_API_URL: process.env.INVENTORY_API_URL,
  INVENTORY_MEMCACHE_URL: process.env.INVENTORY_MEMCACHE_URL,
}