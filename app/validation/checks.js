const checks = [].concat(
  require('./check-cs'),
  require('./check-es')
)

module.exports = checks
