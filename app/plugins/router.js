const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/calculate'),
  require('../routes/standards'),
  require('../routes/validate')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
