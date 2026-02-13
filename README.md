<<<<<<< HEAD
# The Silent Server (Backend Debugging Assignment)

This API is intentionally broken. Your task is to debug it and complete the authentication flow.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```
   Server runs at: `http://localhost:3000`

## Assignment Objective

The goal is to fix the broken authentication endpoints so that a user can:
1.  **Login** to get a session ID and OTP.
2.  **Verify the OTP** to get a valid session cookie.
3.  **Exchange the Session** for a JWT Access Token.
4.  **Access Protected Routes** using the token.

You will need to use your browser's developer tools, network inspection, and server logs to debug.

---

## Tasks & Verification

### Task 1: Fix Login
**Endpoint:** `POST /auth/login`
The server should generate a session and log an OTP to the console.

**Test Command:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<YOUR_EMAIL@example.com>","password":"password123"}'
```
**Expected Outcome:**
- Server logs the OTP (e.g., `[OTP] Session abc12345 generated`).
- Response contains `loginSessionId`.

### Task 2: Fix OTP Verification
**Endpoint:** `POST /auth/verify-otp`
The server fails to verify the OTP correctly. You need to find out why.
*Hint: Check data types and how cookies are set.*

**Test Command:**
(Replace `<loginSessionId>` and `<otp>` with values from Task 1)
```bash
curl -c cookies.txt -X POST http://localhost:3000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"loginSessionId":"<loginSessionId>","otp":"<otp_from_logs>"}'
```
**Expected Outcome:**
- `cookies.txt` is created containing a session cookie.
- Response says "OTP verified".

### Task 3: Fix Token Generation
**Endpoint:** `POST /auth/token`
This endpoint is supposed to issue a JWT, but it has a bug in how it reads the session.

**Test Command:**
```bash
# Uses the cookie captured in Task 2
curl -b cookies.txt -X POST http://localhost:3000/auth/token
```
**Expected Outcome:**
- Response contains `{ "access_token": "..." }`.

### Task 4: Fix Protected Route Access
**Endpoint:** `GET /protected`
Ensure the middleware correctly validates the token.

**Test Command:**
```bash
# Replace <jwt> with the token from Task 3
curl -H "Authorization: Bearer <jwt>" http://localhost:3000/protected
```
**Expected Outcome:**
- Response: `{ "message": "Access granted", "user": ... }`

---


## Expected Output

After fixing the bugs, you should be able to run the following sequence successfully:

1.  **Login**: Receive a `loginSessionId` and see an OTP in the server logs.
2.  **Verify OTP**: Receive a session cookie (`session_token`).
3.  **Get Token**: Exchange the session cookie for a JWT (`access_token`).
4.  **Access Protected Route**: Use the JWT to get a 200 OK response with user details and a **unique Success Flag**.

**Important**: You must use **your own email address** when testing the login flow. The success flag is generated based on the email you use.




## Submission

To submit your assignment:

1.  Push your code to a **Public GitHub Repository**.
2.  Add a file named `output.txt` in your repository.
    *   This file must contain the terminal output of all 4 test commands (Login, Verify OTP, Get Token, Access Protected Route).
    *   Ensure the final command's output showing the `success_flag` is clearly visible in this file.
3.  Share the link to your repository.
=======

#BROKEN AUTHENTICATION ASSIGNMENT 

 "Fixed and completed a broken authentication system using Node.js and Express. Implemented secure login, OTP verification, session-based JWT issuance, and protected routes with proper environment variable handling and middleware fixes.”

Project Name : Broken Authentication Assignment
Tech Stack   : Node.js, Express.js, JWT, Cookies
Server Port  : 3000
Environment  : Local Development


#STEP 0 – SERVER START

Command:
npx nodemon

Terminal Output:
[nodemon] 3.1.11
[nodemon] starting `node server.js`
[dotenv@17.2.4] injecting env (3) from .env
Server running on port 3000

#STEP 1 – LOGIN

API:
POST /auth/login

Request Body:
{
  "email": "ashmit873697@gmail.com",
  "password": "password123"
}

Terminal Output:
POST /auth/login
[OTP] Session 6c51203cbd1a75df generated. OTP: 406597
POST /auth/login -> 200 (5ms)

Response:
{
  "loginSessionId": "6c51203cbd1a75df"
}

Explanation:
• Login credentials validated
• A temporary login session is created
• A 6-digit OTP is generated and logged on server

#STEP 2 – VERIFY OTP

API:
POST /auth/verify-otp

Request Body:
{
  "loginSessionId": "6c51203cbd1a75df",
  "otp": "406597"
}

Terminal Output:
POST /auth/verify-otp
POST /auth/verify-otp -> 200 (2ms)

Response:
{
  "message": "OTP verified"
}

Explanation:
• OTP matched successfully
• Secure session cookie `session_token` issued
• Cookie stored on client for further authentication

#STEP 3 – GET JWT TOKEN

API:
POST /auth/token

Cookie Sent:
session_token=2b0455121c0bbf52afa13db9d01e65f8

Terminal Output:
POST /auth/token
Cookie received: 2b0455121c0bbf52afa13db9d01e65f8
All login sessions:
{
  "6c51203cbd1a75df": {
    "email": "ashmit873697@gmail.com",
    "otp": "406597",
    "sessionToken": "2b0455121c0bbf52afa13db9d01e65f8"
  }
}
POST /auth/token -> 200 (5ms)

Response:
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzaG1pdDg3MzY5N0BnbWFpbC5jb20iLCJpYXQiOjE3NzEwMDI2NTMsImV4cCI6MTc3MTAwNjI1M30.63TpVEGRvnJwOeOjmw-hG0HGl0cJcBihKewan8yUJaQ"
}

Explanation:
• Session cookie validated
• JWT access token generated using JWT_SECRET
• Token contains authenticated user email

#STEP 4 – ACCESS PROTECTED ROUTE

API:
GET /protected

Request Header:
Authorization: Bearer <JWT_TOKEN_GENERATED>

Terminal Output:
GET /protected
GET /protected -> 200 (124ms)

Response:
{
  "message": "Access granted",
  "user": {
    "email": "ashmit873697@gmail.com",
    "iat": 1771002653,
    "exp": 1771006253
  },
  "success_flag": "P9JB/UfJ/lH0qSqBGak0G/CViLEb8tpArmc+5OorhQY="
}

Explanation:
• JWT verified successfully via auth middleware
• User identity extracted from token
• Unique success_flag generated using secure HMAC logic  

 #BUG ANALYSIS

This document explains all major bugs found in the original (commented)
codebase and the fixes applied to make the authentication flow work correctly.



#1. ENVIRONMENT VARIABLE ISSUE (MAIN BUG)

❌ PROBLEM
APPLICATION_SECRET was always undefined.

Terminal Output:
Loaded APPLICATION_SECRET: undefined

❌ ROOT CAUSE
The project had a `.env.example` file instead of a real `.env` file.
The dotenv package loads only `.env`, NOT `.env.example`.

❌ ISSUE CODE
// .env.example (wrong)
APPLICATION_SECRET=xxxx
JWT_SECRET=xxxx

✅ FIX
Rename file:
.env.example  ❌
.env          ✅

Correct `.env` file:
APPLICATION_SECRET=mongodb+srv://akashmit8736_db_user:Ashmit8736@cluster0.m5mq3v9.mongodb.net/Assignment
JWT_SECRET=my_jwt_secret
PORT=3000

Also ensure dotenv is loaded FIRST:

require("dotenv").config();

✅ RESULT
Environment variables load correctly and token generation works.

#2. LOGIN VALIDATION LOGIC BUG

❌ ISSUE CODE (Commented)
if (!email || !password) {
  return res.status(400).json({ error: "Email and password required" });
}

❌ PROBLEM
Any password was accepted.
This breaks assignment logic.

✅ FIXED CODE
if (!email || password !== "password123") {
  return res.status(400).json({ error: "Invalid credentials" });
}

✅ WHY
Assignment requires a fixed password for testing consistency.


#3. OTP VERIFICATION TYPE MISMATCH (CRITICAL)

❌ ISSUE CODE (Commented)
if (parseInt(otp) !== otpStore[loginSessionId]) {
  return res.status(401).json({ error: "Invalid OTP" });
}

❌ PROBLEM
OTP was stored as STRING but compared as NUMBER.
OTP verification always failed.

✅ FIXED CODE
if (session.otp !== otp.toString()) {
  return res.status(400).json({ error: "Invalid OTP" });
}

✅ RESULT
OTP verification works correctly.

#4. SESSION COOKIE HANDLING BUG (BIG FIX)

❌ ISSUE CODE (Commented)
res.cookie("session_token", loginSessionId);

❌ PROBLEM
loginSessionId was used as a session token.
No secure or unique session token existed.

✅ FIXED CODE
const sessionToken = crypto.randomBytes(16).toString("hex");
session.sessionToken = sessionToken;

res.cookie("session_token", sessionToken, {
  httpOnly: true,
});

✅ RESULT
Proper session token is stored and validated securely.

#5. TOKEN EXCHANGE FLOW BUG

❌ ISSUE CODE (Commented)
const token = req.headers.authorization;

Expected:
Authorization: Bearer <sessionId>

❌ PROBLEM
Assignment requires:
SESSION COOKIE ➜ JWT
Not header-based session exchange.

✅ FIXED CODE
const sessionToken = (req.cookies.session_token || "").trim();

const session = Object.values(loginSessions).find(
  (s) => s.sessionToken === sessionToken
);

✅ RESULT
JWT is correctly issued using session cookie.

#6. JWT SECRET HANDLING ISSUE

❌ PROBLEM
JWT verification failed when env variables were missing.

❌ ISSUE CODE
jwt.verify(token, process.env.JWT_SECRET);

✅ FIX
const jwtSecret = process.env.JWT_SECRET || "default-secret-key";

✅ RESULT
JWT verification works reliably.

#7. PROTECTED ROUTE ASYNC ERROR

❌ ISSUE CODE (Commented)
app.get("/protected", authMiddleware, (req, res) => {
  const success_flag = generateToken(req.user.email);
});

❌ PROBLEM
generateToken is async but not awaited.
Server crashed on error.

✅ FIXED CODE
app.get("/protected", authMiddleware, async (req, res) => {
  const success_flag = await generateToken(req.user.email);

  res.json({
    message: "Access granted",
    user: req.user,
    success_flag,
  });
});

✅ RESULT
Protected route returns 200 OK with success_flag.

#FINAL STATUS

✔ Login works
✔ OTP verification works
✔ Session cookie is set
✔ JWT is generated
✔ Protected route returns success_flag

#Assignment authentication flow completed successfully.

>>>>>>> 55a6775e37a6ecc3f1ddd1b82a4a35001db4d7ef
