const { createMongoAbility, ForbiddenError } = require("@casl/ability")

module.exports = (action, adminSubject) => {
  return (req, res, next) => {
    const ability = createMongoAbility(JSON.parse(req.admin.permissions))
    ForbiddenError.from(ability).throwUnlessCan(action, adminSubject)
    return next()
  }
}