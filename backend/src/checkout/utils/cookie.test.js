const { unlockCookieForDevelopment } = require('./cookie')

const axiosResponse = {
    headers: {
        'set-cookie': [
            'JSESSIONID=WUXpCNVhDD0dA-cwKzk1rdQA.com1; Path=/; Secure; HttpOnly',
            'SOMEOTHERCOOKIE=value; Path=/; Domain=www.google.com;'
        ]
    },
    data: { prop: 'value' }
}

describe('cookie.js', () => {
  describe('unlockCookieForDevelopment() - .xyz environments', () => {
    process.env.ATG_URL = 'http://www.something.xyz/test'
    const result = unlockCookieForDevelopment(axiosResponse)
    it('should return an object the data property', () => {
        expect(result).toHaveProperty('data')
        expect(result.data.prop).toBe('value')
    })
    it('should return an object the headers property', () => {
        expect(result).toHaveProperty('cookies')
    })
    it('should remove Secure and HttpOnly from the set-cookie header', () => {
        console.log(process.env.ATG_URL)
        expect(result.cookies[0]).toBe('JSESSIONID=WUXpCNVhDD0dA-cwKzk1rdQA.com1; Path=/;  ')
        expect(result.cookies[1]).toBe('SOMEOTHERCOOKIE=value; Path=/; Domain=www.google.com;')
    })
  })
  describe('unlockCookieForDevelopment() - .com environments', () => {
    process.env.ATG_URL = 'http://www.something.com/test'
    const result = unlockCookieForDevelopment(axiosResponse)
    it('should return an object the data property', () => {
        expect(result).toHaveProperty('data')
        expect(result.data.prop).toBe('value')
    })
    it('should return an object the headers property', () => {
        expect(result).toHaveProperty('cookies')
    })
    it('should remove Secure and HttpOnly from the set-cookie header', () => {
        console.log(process.env.ATG_URL)
        expect(result.cookies[0]).toBe('JSESSIONID=WUXpCNVhDD0dA-cwKzk1rdQA.com1; Path=/; Secure; HttpOnly')
        expect(result.cookies[1]).toBe('SOMEOTHERCOOKIE=value; Path=/; Domain=www.google.com;')
    })
  })
})
