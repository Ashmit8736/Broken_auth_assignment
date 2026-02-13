require("dotenv").config();  
//console.log("Loaded APPLICATION_SECRET:", process.env.APPLICATION_SECRET); 
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { generateToken } = require("./utils/tokenGenerator");
const authMiddleware = require("./middleware/auth");
const requestLogger = require("./middleware/requestLogger");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

const loginSessions = {};


// LOGIN

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || password !== "password123") {
    return res.status(400).json({ error: "Email and password required" });
  }

  const loginSessionId = crypto.randomBytes(8).toString("hex");
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  loginSessions[loginSessionId] = {
    email,
    otp,
  };

  console.log(`[OTP] Session ${loginSessionId} generated. OTP: ${otp}`);

  res.json({ loginSessionId });
});


// VERIFY OTP

app.post("/auth/verify-otp", (req, res) => {
  const { loginSessionId, otp } = req.body;

  const session = loginSessions[loginSessionId];

  if (!session) {
    return res.status(400).json({ error: "Invalid session" });
  }

  if (session.otp !== otp.toString()) {  // ✅ STRING FIX
    return res.status(400).json({ error: "Invalid OTP" });
  }

  const sessionToken = crypto.randomBytes(16).toString("hex");

  session.sessionToken = sessionToken;

  res.cookie("session_token", sessionToken, {
    httpOnly: true,
  });

  res.json({ message: "OTP verified" });
});

// JWT

app.post("/auth/token", async (req, res) => {
  const sessionToken = (req.cookies.session_token || "").trim();

  console.log("Cookie received:", sessionToken);
  console.log("All login sessions:", loginSessions);

  if (!sessionToken) {
    return res.status(401).json({ error: "No session cookie" });
  }

  const session = Object.values(loginSessions).find(
    (s) => s.sessionToken === sessionToken
  );

  if (!session) {
    return res.status(401).json({ error: "Invalid session" });
  }

  const jwtSecret = process.env.JWT_SECRET|| "default-secret-key";

  const access_token = jwt.sign(
    { email: session.email },
    jwtSecret,
    { expiresIn: "1h" }
  );

  res.json({ access_token });
});


// PROTECTED ROUTE

app.get("/protected", authMiddleware, async (req, res) => {
  try {
    const success_flag = await generateToken(req.user.email);

    res.json({
      message: "Access granted",
      user: req.user,
      success_flag,
    });
  } catch (error) {
    console.error("Protected route error:", error.message);
    res.status(500).json({ error: "Server error generating token" });
  }
});


app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});
