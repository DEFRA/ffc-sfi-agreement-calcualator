const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('./config').storageConfig
let blobServiceClient
let containersInitialised

if (config.useConnectionStr) {
  blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionStr)
} else {
  const uri = `https://${config.storageAccount}.blob.core.windows.net`
  blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential())
}

const parcelContainer = blobServiceClient.getContainerClient(config.parcelContainer)
const parcelSpatialContainer = blobServiceClient.getContainerClient(config.parcelSpatialContainer)
const parcelStandardContainer = blobServiceClient.getContainerClient(config.parcelStandardContainer)
const standardContainer = blobServiceClient.getContainerClient(config.standardContainer)

const initialiseContainers = async () => {
  await parcelContainer.createIfNotExists()
  await parcelSpatialContainer.createIfNotExists()
  await parcelStandardContainer.createIfNotExists()
  await standardContainer.createIfNotExists()
  containersInitialised = true
}

const getBlob = async (container, filename) => {
  containersInitialised ?? await initialiseContainers()
  return container.getBlockBlobClient(filename)
}

const fileExists = async (containerName, filename) => {
  containersInitialised ?? await initialiseContainers()
  const container = getContainer(containerName)
  const fileList = []
  for await (const item of container.listBlobsFlat()) {
    fileList.push(item.name)
  }
  return fileList.includes(filename)
}

const downloadFile = async (containerName, filename) => {
  containersInitialised ?? await initialiseContainers()
  const container = getContainer(containerName)
  const blob = await getBlob(container, filename)
  const downloaded = await blob.downloadToBuffer()
  return downloaded.toString()
}

const getContainer = (containerName) => {
  switch (containerName) {
    case config.parcelContainer:
      return parcelContainer
    case config.parcelSpatialContainer:
      return parcelSpatialContainer
    case config.parcelStandardContainer:
      return parcelStandardContainer
    case config.standardContainer:
      return standardContainer
    default:
      throw new Error(`Undefined storage container: ${containerName}`)
  }
}

const getBlobClient = async (containerName, filename) => {
  containersInitialised ?? await initialiseContainers()
  const container = getContainer(containerName)
  return container.getBlockBlobClient(filename)
}

module.exports = {
  downloadFile,
  blobServiceClient,
  getBlobClient,
  fileExists
}
