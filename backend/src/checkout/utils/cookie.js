const { get, defaults } = require('partial.lenses')

const isRequestForDev = () => process.env.ATG_URL.includes('.xyz')
const getSetCookie = get(['headers', 'set-cookie', defaults([])])
const unsecureCookie = arr => arr.map(str => str.replace('HttpOnly', '').replace('Secure;', ''))
const cookies = axiosReturn =>
  isRequestForDev() ? unsecureCookie(getSetCookie(axiosReturn)) : getSetCookie(axiosReturn)

// If the response from axios comes from a .xyz domain, we unlock the cookie
const unlockCookieForDevelopment = axiosReturn => ({
  data: axiosReturn.data,
  cookies: cookies(axiosReturn),
})

module.exports = {
  unlockCookieForDevelopment,
}
