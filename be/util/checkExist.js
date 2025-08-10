const { response } = require('../util/response');
const { responseStatus } = require('../langs/vn');
const User = require('../user_components/models/user.model');

async function checkExistUser(field, value, id, res, error) {
  const user = await User.findOne({ [field]: value });
  if (user && user.id !== id) {
    return res.status(400).json(response(responseStatus.fail, error));
  }

  return null;
}

module.exports = {
  checkExistUser,
};
