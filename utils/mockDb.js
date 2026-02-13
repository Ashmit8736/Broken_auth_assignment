const getSecretFromDB = async () => {
  await new Promise((resolve) => setTimeout(resolve, 120));

  const secret = process.env.APPLICATION_SECRET;
  if (!secret) {
    throw new Error(
      "Mock DB error: APPLICATION_SECRET env var for token generation."
    );
  }
  return secret;
};

module.exports = { getSecretFromDB };

