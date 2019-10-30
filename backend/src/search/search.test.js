const axios = require('axios')
const xml2json = require('xml2json')
const { searchReq } = require('./search')
const { DOMAIN } = require('../config')

describe('Serverless - search', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return a 500 error if ATG throws', () => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce(
      {
        response: {
          data: {
            code: 500,
            error: 'Sorry, an unknown error has occurred.',
          }
        }
      }
    )

    const req = {
      query: {
        q: 'jeans',
      },
      headers: {
        cookie: 'JSESSIONID: randomstring'
      },
    }

    return searchReq(req)
      .then(() => jest.fail())
      .catch(res => {
        expect(res.code).toBe(500)
        expect(res.error).toEqual('Sorry, an unknown error has occurred.')
      })
  })

  it('should return empty array if XML records not found', () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: '' })

    const req = {
      query: {
        q: 'jeans',
      },
      headers: {
        cookie: 'JSESSIONID: randomstring'
      },
    }

    return searchReq(req).then(result => {
      expect(result).toEqual([])
    })
  })

  it('should return empty array if passed no query, without calling ATG', () => {
    const spy = jest.spyOn(axios, 'get')

    const req = {
      query: {
        q: null,
      },
      headers: {
        cookie: 'JSESSIONID: randomstring'
      },
    }

    return searchReq(req).then(result => {
      expect(result).toEqual([])
      expect(spy).not.toHaveBeenCalled()
    })
  })

  it('should default to ca language if not specified', () => {
    const spy = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: '' })

    const req = {
      query: {
        q: 'jeans',
      },
      headers: {
        cookie: 'JSESSIONID: randomstring'
      },
    }

    return searchReq(req).then(() => {
      const EXPECTED = {
        headers: {
          Accept: 'application/xhtml+xml,application/xml',
          cookie: 'JSESSIONID: randomstring',
        },
        params: {
          format: 'xml',
          Ntt: 'jeans',
        },
      }

      expect(spy).toHaveBeenCalledWith(`https://www.${DOMAIN}/ca/search/type-ahead/type-ahead.jsp`, EXPECTED)
    })
  })

  it('should default to ca language if unsupported one', () => {
    const spy = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: '' })

    const req = {
      query: {
        q: 'jeans',
        lang: 'es',
        random: 'willNotBeUsed',
      },
      headers: {
        cookie: 'JSESSIONID: randomstring'
      },
    }

    return searchReq(req).then(() => {
      const EXPECTED = {
        headers: {
          Accept: 'application/xhtml+xml,application/xml',
          cookie: 'JSESSIONID: randomstring',
        },
        params: {
          format: 'xml',
          Ntt: 'jeans',
        },
      }

      expect(spy).toHaveBeenCalledWith(`https://www.${DOMAIN}/ca/search/type-ahead/type-ahead.jsp`, EXPECTED)
    })
  })

  it('should use correct language if valid one (ca)', () => {
    const spy = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: '' })

    const req = {
      query: {
        q: 'jeans',
        lang: 'ca',
      },
      headers: {
        cookie: 'JSESSIONID: randomstring'
      },
    }

    return searchReq(req).then(() => {
      const EXPECTED = {
        headers: {
          Accept: 'application/xhtml+xml,application/xml',
          cookie: 'JSESSIONID: randomstring',
        },
        params: {
          format: 'xml',
          Ntt: 'jeans',
        },
      }

      expect(spy).toHaveBeenCalledWith(`https://www.${DOMAIN}/ca/search/type-ahead/type-ahead.jsp`, EXPECTED)
    })
  })

  it('should use correct language if valid one (us)', () => {
    const spy = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: '' })

    const req = {
      query: {
        q: 'jeans',
        lang: 'us',
      },
      headers: {
        cookie: 'JSESSIONID: randomstring'
      },
    }

    return searchReq(req).then(() => {
      const EXPECTED = {
        headers: {
          Accept: 'application/xhtml+xml,application/xml',
          cookie: 'JSESSIONID: randomstring',
        },
        params: {
          format: 'xml',
          Ntt: 'jeans',
        },
      }

      expect(spy).toHaveBeenCalledWith(`https://www.${DOMAIN}/us/search/type-ahead/type-ahead.jsp`, EXPECTED)
    })
  })

  it('should use correct language if valid one (fr-ca)', () => {
    const spy = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: '' })

    const req = {
      query: {
        q: 'jeans',
        lang: 'fr-ca',
      },
      headers: {
        cookie: 'JSESSIONID: randomstring'
      },
    }

    return searchReq(req).then(() => {
      const EXPECTED = {
        headers: {
          Accept: 'application/xhtml+xml,application/xml',
          cookie: 'JSESSIONID: randomstring',
        },
        params: {
          format: 'xml',
          Ntt: 'jeans',
        },
      }

      expect(spy).toHaveBeenCalledWith(`https://www.${DOMAIN}/fr-ca/search/type-ahead/type-ahead.jsp`, EXPECTED)
    })
  })

  it('should map XML results to JSON, trimming out unnecessary data', () => {
    const json = require('./fixtures/search.fixture.json')
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: xml2json.toXml(json, { sanitize: true }) })

    const req = {
      query: {
        q: 'jeans',
      },
      headers: {
        cookie: 'JSESSIONID: randomstring'
      },
    }

    return searchReq(req).then(result => {
      const EXPECTED = [
        {
          url: 'racerback-lace-bralette/p/100033313',
          text: 'Racerback Lace Bralette',
          repositoryId: '100033313',
        },
        {
          url: 'kate-high-rise-black-distressed-skinny-jean/p/100027385',
          text: 'Kate High Rise Black Distressed Skinny Jean',
          repositoryId: '100027385',
        },
        {
          url: 'cara-high-rise-light-wash-distressed-jeans/p/100020253',
          text: 'Cara High Rise Distressed Jeans',
          repositoryId: '100020253',
        },
      ]

      expect(result).toEqual(EXPECTED)
    })
  })

  it('should map XML results to JSON, trimming out unnecessary data, when one result only', () => {
    const json = require('./fixtures/search-one-result.fixture.json')
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: xml2json.toXml(json, { sanitize: true }) })

    const req = {
      query: {
        q: 'cara',
      },
      headers: {
        cookie: 'JSESSIONID: randomstring'
      },
    }

    return searchReq(req).then(result => {
      const EXPECTED = [
        {
          url: 'cara-high-rise-light-wash-distressed-jeans/p/100020253',
          text: 'Cara High Rise Distressed Jeans',
          repositoryId: '100020253',
        },
      ]

      expect(result).toEqual(EXPECTED)
    })
  })
})
