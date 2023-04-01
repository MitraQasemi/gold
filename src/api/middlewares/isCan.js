const { createMongoAbility, ForbiddenError } = require("@casl/ability")
const { ApiError } = require("./error");

module.exports = (action, adminSubject) => {
  return (req, res, next) => {
    try {
      const ability = createMongoAbility(JSON.parse(req.admin.permissions))
      ForbiddenError.from(ability).throwUnlessCan(action, adminSubject)
    } catch (error) {
      return next( new ApiError(500, error.message));
    }
    return next()
  }
}