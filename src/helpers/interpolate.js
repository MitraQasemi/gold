const interpolate = (permissions, subject, conditions = {}) => {
  const permissionsArray = []
  for (let i = 0; i < permissions.length; i++) {
    permissionsArray[i] = { action: permissions[i], subject: subject, conditions: conditions }
  }
  return permissionsArray;
}

module.exports = interpolate