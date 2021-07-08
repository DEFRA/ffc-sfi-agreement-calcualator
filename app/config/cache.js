const defaultExpiresIn = 3600 * 1000 // 1 hour

module.exports = {
  eligibilitySegment: {
    name: 'eligibility',
    expiresIn: defaultExpiresIn
  },
  standardsSegment: {
    name: 'standards',
    expiresIn: defaultExpiresIn
  },
  validationSegment: {
    name: 'validation',
    expiresIn: defaultExpiresIn
  },
  calculationSegment: {
    name: 'calculation',
    expiresIn: defaultExpiresIn
  },
  requestSBISegment: {
    name: 'request-sbi',
    expiresIn: defaultExpiresIn
  },
  redisCatboxOptions: {
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    partition: process.env.REDIS_PARTITION ?? 'ffc-sfi-agreement-calculator',
    tls: process.env.NODE_ENV === 'production' ? {} : undefined
  }
}
