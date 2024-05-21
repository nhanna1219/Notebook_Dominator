const bcrypt = require("bcryptjs");
const crypto = require('crypto');

function generateRandomPassword(length) {
  return crypto.randomBytes(length).toString('hex');
}

async function hashPassword(password) {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Hashing error:', error);
    throw error;
  }
}

module.exports = {
    generateRandomPassword,
    hashPassword
};
