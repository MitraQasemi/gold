const { createMongoAbility, ForbiddenError } = require("@casl/ability")

module.exports = (action, adminSubject) => {
  return (req, res, next) => {
    try {
      console.log(`action ${action} subject ${adminSubject}`);
      console.log(JSON.parse(req.admin.permissions));
      const ability = createMongoAbility(JSON.parse(req.admin.permissions))


      ForbiddenError.from(ability).throwUnlessCan(action, adminSubject)
      return next()
    } catch (error) {
      console.log(error);
    }

  }
}