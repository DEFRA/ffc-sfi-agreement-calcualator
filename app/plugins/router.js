const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/calculate'),
  require('../routes/eligibility'),
  require('../routes/standards'),
  require('../routes/validate'),
  require('../routes/map'),
  require('../routes/map/parcel')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
