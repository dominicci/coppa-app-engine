const quantor = require('quantor')
const { Ok, Err, get } = require('pratica')
const config = require('./src')

// hasMethodHandler :: Config -> HttpRequest -> Result
const hasMethodHandler = config => req =>
  config.handlers[req.method] ? Ok(config.handlers[req.method]) : Err({ code: 405, error: 'Method not allowed' })

// hasBodyParams :: HttpRequest -> MethodHandler -> Result
const hasBodyParams = req => handler => (handler.requiredBodyParams ? checkBodyParams(req)(handler) : Ok(handler))

// hasQueryParams :: HttpRequest -> MethodHandler -> Result
const hasQueryParams = req => handler => (handler.requiredQueryParams ? checkQueryParams(req)(handler) : Ok(handler))

// checkBodyParams :: HttpRequest -> MethodHandler -> Result
const checkBodyParams = req => handler =>
  Ok(handler.requiredBodyParams.filter(param => !req.body.hasOwnProperty(param.name))).chain(bodies =>
    bodies.length
      ? Err({
          code: 400,
          error: `Missing body param(s): ${bodies.map(b => b.name).join(', ')}`,
        })
      : Ok(handler)
  )

// checkQueryParams :: HttpRequest -> MethodHandler -> Result
const checkQueryParams = req => handler =>
  Ok(handler.requiredQueryParams.filter(param => !req.query.hasOwnProperty(param.name))).chain(queries =>
    queries.length
      ? Err({
          code: 400,
          error: `Missing query param(s): ${queries.map(q => q.name).join(', ')}`,
        })
      : Ok(handler)
  )

// validateRequest :: HttpRequest -> Config -> Result
const validateRequest = req => config =>
  hasMethodHandler(config)(req)
    .chain(hasBodyParams(req))
    .chain(hasQueryParams(req))

// isHttpRequest :: Props -> Maybe Body
const isHttpRequest = get([0, 'body'])

// props[0] = req, props[1] = res
// httpBranch :: Props -> Config -> IO
const httpBranch = props => config =>
  validateRequest(props[0])(config).cata({
    Ok: configHandler => configHandler.handler(...props),
    Err: e => props[1].status(e.code).send({ error: e.error }),
  })

// eventBranch :: Props -> Config -> IO
const eventBranch = props => config => config.handlers.EVENT.handler(...props)

// addConfigToApi :: (Accumlator, Config) -> API
const addConfigToApi = (acc, config) =>
  Object.assign({}, acc, {
    // The props passed below can be anything, event, request/response or anything else.
    // so this function just forwards all the params to the handler 'as is' without modification
    [config.name]: (...props) =>
      isHttpRequest(props).cata({
        Just: () => httpBranch(props)(config),
        Nothing: () => eventBranch(props)(config),
      }),
  })

// createApi :: Config[] -> API
const createApi = configs =>
  configs.reduce(addConfigToApi, {
    docs: (req, res) => quantor(config)(html => res.set('Content-Type', 'text/html').send(new Buffer(html))),
  })

module.exports = createApi(config.endpoints)