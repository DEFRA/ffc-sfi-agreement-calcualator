const getStandardWarnings = (standards) => {
  const warnings = []
  standards.map(x => x.parcels.map(y => y.warnings.map(z => warnings.push({ type: Object.keys(z)[0] }))))
  return warnings
}

module.exports = getStandardWarnings
