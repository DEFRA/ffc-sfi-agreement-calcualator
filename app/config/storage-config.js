const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  connectionStr: Joi.string().when('useConnectionStr', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  storageAccount: Joi.string().required(),
  parcelContainer: Joi.string().default('parcels'),
  parcelSpatialContainer: Joi.string().default('parcels-spatial'),
  parcelStandardContainer: Joi.string().default('parcels-standard'),
  standardContainer: Joi.string().default('standards'),
  useConnectionStr: Joi.boolean().default(false)
})

// Build config
const config = {
  connectionStr: process.env.AZURE_STORAGE_CONNECTION_STRING,
  storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  parcelContainer: process.env.AZURE_STORAGE_PARCEL,
  parcelSpatialContainer: process.env.AZURE_STORAGE_PARCEL_SPATIAL,
  parcelStandardContainer: process.env.AZURE_STORAGE_PARCEL_STANDARD,
  standardContainer: process.env.AZURE_STORAGE_STANDARD,
  useConnectionStr: process.env.AZURE_STORAGE_USE_CONNECTION_STRING === 'true'
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The blob storage config is invalid. ${result.error.message}`)
}

module.exports = result.value
