const crypto = require("crypto");
const { getSecretFromDB } = require("./mockDb");

const generateToken = async (email) => {
  try {
    const secret = await getSecretFromDB();

    return crypto
      .createHmac("sha256", secret)
      .update(email)
      .digest("base64");
  } catch (error) {
    console.error("Token generation failed:", error.message);
    throw error;   // this line ensures that the error is propagated and can be handled by the caller, preventing silent failures.
  }
};

module.exports = { generateToken };  
