async function filterExistingSFIAgreements (landCover) {
  // Filter out any areas that are already used
  // in parcels for conflicting land covers
}

async function checkExistingSFIAgreements (id) {
  return { id, result: false }
}

module.exports = {
  filterExistingSFIAgreements,
  checkExistingSFIAgreements
}
