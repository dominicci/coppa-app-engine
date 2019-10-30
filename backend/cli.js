#!/usr/bin/env node

const fs = require('fs')
const cors = require('cors')
const path = require('path')
const program = require('commander')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const yaml = require('js-yaml')
const quantor = require('quantor')
const { Ok, Err, encaseRes } = require('pratica')

const readServerlessYaml = (filePath, stage, showService = true, prefix = '') =>
  encaseRes(() => yaml.safeLoad(fs.readFileSync(filePath, 'utf8')))
    .mapErr(err => `Error reading yaml file: ${filePath}, \nError: ${err}`)
    .chain(yml => yml.functions ? Ok(yml) : Err(`No functions declared in yaml file: ${config}`))
    .map(({ functions, service }) => Object.keys(functions).map(key => ({
      name: getFunctionName(service, showService)(stage)(prefix)(key),
      display: functions[key].name,
      description: functions[key].description,
      handler: functions[key].handler
    })))

const getFunctionName = (service, showService) => stage => prefix => name =>
    encaseRes(()=> name)
    .map((functionName) => stage ? `${stage}-${functionName}` : `${functionName}`)
    .map((functionName) => showService ? `${service}-${functionName}` : `${functionName}`)
    .map((functionName) => prefix ? `/${prefix}-${functionName}` : `/${functionName}`)
    .cata({
      Ok: functionName => functionName,
      Err: () => name
    })

const readFunctionsJs = filePath =>
  encaseRes(() => require(path.resolve(filePath)))
    .mapErr(err => `Could not read main functions module: ${filePath}, \nError: ${err}`)

const sanitizeFuncs = ({ handlers, funcsMod }) => handlers
  .map(({ name, display, description, handler }) => ({ name, display, description, handler: funcsMod[handler] }))
  .filter(({ handler }) => !!handler)

const createServer = (showQuantor = true) => (logFormat = 'dev') => port => funcs => {
  const app = express()
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(morgan(logFormat))
  app.use(cors())

  funcs.map(({ name, handler }) => console.log(name) || app.all(name, handler))
  if(showQuantor){
    app.get('/', (req, res) => quantor({
      title: 'Coppa Server',
      endpoints: funcs.map(({ name, display, description }) => ({
        name,
        description: description || 'No description provided...',
        display: display || 'No name provided...',
        handlers: { GET: {}, POST: {}, PUT: {}, DELETE: {} }
      }))
    })(html => res.send(html)))
  }
  app.listen(port, () => console.log(`Coppa listening on port ${port}!`))
  // Health check
  app.get('/health', (req, res) => res.status(200).json('healthy'))
}

const stringToBoolean =(string) =>{
  switch(string.toLowerCase().trim()){
      case "true": case "yes": case "1": return true;
      case "false": case "no": case "0": case null: return false;
      default: return Boolean(string);
  }
}

const start = opts => {
  const port = opts.port || 8080
  const config = opts.config || './serverless.yml'
  const entry = opts.entry || './index.js'
  const stage = opts.stage
  const logFormat = opts.logFormat
  const showQuantor = opts.showQuantor
  const prefix = opts.prefix || process.env.PREFIX || ''
  const showService = opts.service || 'true'

  readServerlessYaml(config, stage, stringToBoolean(showService), prefix)
    .chain(handlers => readFunctionsJs(entry).map(funcsMod => ({ handlers, funcsMod })))
    .map(sanitizeFuncs)
    .cata({
      Ok: createServer(showQuantor)(logFormat)(port),
      Err: msg => {
        console.error(msg)
        process.exit(1)
      }
    })
}

// --- CLI PROGRAM --- //

program.version('1.0.0')

program
  .command('start')
  .description('Start the Coppa dev server')
  .option('-c, --config [path]', 'Path to serverless config file (default: ./serverless.yml)')
  .option('-e, --entry [path]', 'Path to JS entry point file (default: ./index.js)')
  .option('-s, --stage [stage]', 'Stage to be used')
  .option('-p, --port [port]', 'Port for server to use (default: 8080)')
  .option('-q, --quantor [boolean]', 'Show Quantor Page (true by default)')
  .option('-l, --log [format]', 'Log output format (default dev)')
  .option('-P, --prefix [prefix]','Prefix add it to the function name (default empty)')
  .option('-S, --service [boolean]','Add the service name into the name of the function (default true)')
  .action(start)

program.parse(process.argv)
