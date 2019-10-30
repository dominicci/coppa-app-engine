const { ALGOLIA_PRODUCT_INDEX } = require('../config')
const {
  formatURL,
  formatData,
  formatForAlgolia,
  createAlgoliaRequestQuery,
  formatAlgoliaFilter,
  formatAlgoliaData,
  getSearchIndex,
  styleScoreMap,
} = require('./recommended')

const {
  formatURLFixture,
  formatDataFixture,
  formatForAlgoliaFixture,
  createAlgoliaRequestQueryFixture,
  formatAlgoliaFilterFixture,
  formatAlgoliaDataFixture,
  styleScoreMapFixture,
} = require('./fixtures/recommended.fixture')

describe('recommended.js', () => {
  describe('formatURL', () => {
    it('should return the Gale API url', () => {
      expect(formatURL(formatURLFixture.q1)).toEqual(formatURLFixture.a1)
      expect(formatURL(formatURLFixture.q2)).toEqual(formatURLFixture.a2)
      expect(formatURL(formatURLFixture.q3)).toEqual(formatURLFixture.a3)
      expect(formatURL(formatURLFixture.q4)).toEqual(formatURLFixture.a4)
      expect(formatURL(formatURLFixture.q5)).toEqual(formatURLFixture.a5)
      expect(formatURL(formatURLFixture.q6)).toEqual(formatURLFixture.a6)
    })
  })
  describe('formatData', () => {
    it('returns the proper formatted data result from gale', () => {
      expect(formatData(formatDataFixture.q1)).toEqual(formatDataFixture.a1)
      expect(formatData(formatDataFixture.q2)).toEqual(formatDataFixture.a2)
      expect(formatData(formatDataFixture.q3)).toEqual(formatDataFixture.a3)
    })
  })
  describe('formatForAlgolia', () => {
    it('formats the result set from formatData() and creates data to send to algolia', () => {
      expect(formatForAlgolia(formatForAlgoliaFixture.q1)).toEqual(formatForAlgoliaFixture.a1)
      expect(formatForAlgolia(formatForAlgoliaFixture.q2)).toEqual(formatForAlgoliaFixture.a2)
      expect(formatForAlgolia(formatForAlgoliaFixture.q3)).toEqual(formatForAlgoliaFixture.a3)
    })
  })
  describe('createAlgoliaRequestQuery', () => {
    it('will create the Algolia request', () => {
      expect(
        createAlgoliaRequestQuery(createAlgoliaRequestQueryFixture.q1.a)(createAlgoliaRequestQueryFixture.q1.b)
      ).toEqual(createAlgoliaRequestQueryFixture.a1)
    })
  })
  describe('formatAlgoliaFilter', () => {
    it('will create the filter to be sent to algolia', () => {
      expect(formatAlgoliaFilter(formatAlgoliaFilterFixture.q1)).toEqual(formatAlgoliaFilterFixture.a1)
    })
  })
  describe('formatAlgoliaData', () => {
    it('will format the data returned from algolia', () => {
      expect(formatAlgoliaData(formatAlgoliaDataFixture.q1.a)(formatAlgoliaDataFixture.q1.b)).toEqual(
        formatAlgoliaDataFixture.a1
      )
    })
  })
  describe('getSearchIndex', () => {
    it('should return the correct Algolia Index', () => {
      expect(getSearchIndex('ca')).toEqual(`${ALGOLIA_PRODUCT_INDEX}_en_ca`)
      expect(getSearchIndex('fr-ca')).toEqual(`${ALGOLIA_PRODUCT_INDEX}_fr_ca`)
      expect(getSearchIndex('us')).toEqual(`${ALGOLIA_PRODUCT_INDEX}_en_us`)
    })
  })
  describe('styleScoreMap', () => {
    it('returns a map of gale items with its score', () => {
      expect(styleScoreMap(styleScoreMapFixture.q1)).toEqual(styleScoreMapFixture.a1)
      expect(styleScoreMap(styleScoreMapFixture.q2)).toEqual(styleScoreMapFixture.a2)
      expect(styleScoreMap(styleScoreMapFixture.q3)).toEqual(styleScoreMapFixture.a3)
    })
  })
})
