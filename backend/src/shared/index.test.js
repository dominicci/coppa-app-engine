const s = require('./index')

describe('Serverless - shared', () => {
  describe('getString()', () => {
    it('should have the getString function', () => {
      expect(s.getString).toBeDefined()
    })

    it('should return a string when given an id', () => {
      expect(s.getString('unknown error')).toBe('Sorry, an unknown error has occurred.')
    })

    it('should return a string in french when given an id and the request for french', () => {
      expect(s.getString('unknown error', 'fr-ca')).toBe("Désolé, une erreur inconnue s'est produite.")
    })

    it('should return a string in english when the requested language is unknown', () => {
      expect(s.getString('unknown error', 'es')).toBe('Sorry, an unknown error has occurred.')
    })
  })

  describe('enOrFr()', () => {
    it('should have the enOrFr function', () => {
      expect(s.enOrFr).toBeDefined()
    })

    it('should return default en lang if passed null', () => {
      expect(s.enOrFr(null)).toBe('en')
    })

    it('should return default en lang if passed unknown lang', () => {
      expect(s.enOrFr('unknown lang')).toBe('en')
    })

    it('should return en lang if passed EN', () => {
      expect(s.enOrFr('EN')).toBe('en')
    })

    it('should return en if passed US, uppercase', () => {
      expect(s.enOrFr('US')).toBe('en')
    })

    it('should return fr-ca if passed fr-CA, uppercase', () => {
      expect(s.enOrFr('fr-CA')).toBe('fr')
    })

    it('should return fr if passed fr-CA, uppercase', () => {
      expect(s.enOrFr('fr-CA')).toBe('fr')
    })

    it('should return fr if passed FR, uppercase', () => {
      expect(s.enOrFr('FR')).toBe('fr')
    })
  })

  describe('getLang()', () => {
    it('should have the getLang function', () => {
      expect(s.getLang).toBeDefined()
    })

    it('should return default CA lang if passed null', () => {
      expect(s.getLang(null)).toBe('ca')
    })

    it('should return default CA lang if passed unknown', () => {
      expect(s.getLang('unknown lang')).toBe('ca')
    })

    it('should return us if passed US, uppercase', () => {
      expect(s.getLang('US')).toBe('us')
    })

    it('should return fr-ca if passed fr-CA, uppercase', () => {
      expect(s.getLang('fr-CA')).toBe('fr-ca')
    })
  })

  describe('getBanner()', () => {
    it('should have the getBanner function', () => {
      expect(s.getBanner).toBeDefined()
    })

    it('should return default dynamite banner if passed null', () => {
      expect(s.getBanner(null)).toBe('dynamite')
    })

    it('should return default dynamite banner if passed unknown', () => {
      expect(s.getBanner('unknown banner')).toBe('dynamite')
    })

    it('should return garage if passed GARAGE, uppercase', () => {
      expect(s.getBanner('GARAGE')).toBe('garage')
    })

    it('should return dynamite if passed DYNAMITE, uppercase', () => {
      expect(s.getBanner('DYNAMITE')).toBe('dynamite')
    })
  })

  describe('getCountry()', () => {
    it('should have the getCountry function', () => {
      expect(s.getCountry).toBeDefined()
    })

    it('should return default CA country if passed null', () => {
      expect(s.getCountry(null)).toBe('CA')
    })

    it('should return default CA country if passed invalid country', () => {
      expect(s.getCountry('lol')).toBe('CA')
    })

    it('should return CA lang if passed ca', () => {
      expect(s.getCountry('ca')).toBe('CA')
    })

    it('should return CA country if passed fr-ca', () => {
      expect(s.getCountry('fr-ca')).toBe('CA')
    })

    it('should return US country if passed us', () => {
      expect(s.getCountry('us')).toBe('US')
    })
  })

  describe('getLocale()', () => {
    it('should have the getLocale function', () => {
      expect(s.getLocale).toBeDefined()
    })

    it('should return default CA lang if passed null', () => {
      expect(s.getLocale(null)).toBe('en_CA')
    })

    it('should return default CA lang if passed invalid lang', () => {
      expect(s.getLocale('lol')).toBe('en_CA')
    })

    it('should return CA lang if passed ca', () => {
      expect(s.getLocale('ca')).toBe('en_CA')
    })

    it('should return fr_CA lang if passed fr-ca', () => {
      expect(s.getLocale('fr-ca')).toBe('fr_CA')
    })

    it('should return us if passed US, uppercase', () => {
      expect(s.getLocale('US')).toBe('en_US')
    })

    it('should return fr-ca if passed FR-CA, uppercase', () => {
      expect(s.getLocale('FR-CA')).toBe('fr_CA')
    })
  })
})
