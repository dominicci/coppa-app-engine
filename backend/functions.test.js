const { readFileSync } = require('fs')
const globby = require('globby')
const { safeLoad } = require('js-yaml')

describe('Serverless - Functions', () => {
  const ymls = []

  // load all serverless.yml files
  // note that __dirname is required for CircleCI to behave
  beforeAll(() =>
    globby([`${__dirname}/**/serverless.yml`, `!${__dirname}/**/node_modules/**/serverless.yml`], { cwd: process.cwd() })
      .then(globs => globs.map(glob => readFileSync(glob, 'utf8')))
      .then(files => files.map(safeLoad))
      .then(allYamls => allYamls.forEach(y => ymls.push(y)))
  )

  it('should all have a different name to avoid collisions', () => {
    const unflattened = ymls.map(yml => Object.keys(yml.functions))
    const names = [].concat.apply([], unflattened)

    const hasDupes = a => a.length !== new Set(a).size
    expect(hasDupes(names)).toEqual(false)
  })

  // make sure ALL our serverless.yml files have prependStage=true
  it('should all have prependStage=true', () => {
    ymls.forEach(yml => expect(yml.provider.prependStage).toBe(true))
  })

  // we do not want to use prependService
  it('should all have prependService=true', () => {
    ymls.forEach(yml => expect(yml.provider.prependService).toBe(true))
  })
})
