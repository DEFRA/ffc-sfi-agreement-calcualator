const { Engine } = require('json-rules-engine')
const report = require('./report')

const getRulesEngine = () => {
  const engine = new Engine()

  engine.on('success', async (event, almanac, ruleResult) => {
    report(event, almanac, ruleResult)
  })

  engine.on('failure', async (event, almanac, ruleResult) => {
    report(event, almanac, ruleResult)
  })

  return engine
}

module.exports = getRulesEngine
