const bcrypt = require("bcrypt");

const hashPassword = async (plain) => {
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(plain, saltRounds);
  return hashPassword;
};

const generateImageKey = (file) => {
  const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
  return `${file?.name}_${uniqueSuffix}`;
};

module.exports = {
  hashPassword,
  generateImageKey,
};
