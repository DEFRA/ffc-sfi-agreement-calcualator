const wreck = require('@hapi/wreck')
const config = require('../config')
const { publicApi } = config

const get = async (url) => {
  const { payload } = await wreck.get(`${publicApi}${url}`, getConfiguration())
  return payload
}

const getConfiguration = () => {
  return {
    json: true
  }
}

module.exports = {
  get
}
