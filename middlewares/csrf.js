const crypto = require("crypto");

// Middleware to attach CSRF token to response
exports.attachToken = (req, res, next) => {
  const csrfToken = generateToken();
  // Store CSRF token in the session or any other storage mechanism
  req.session.csrfToken = csrfToken;
  // Attach CSRF token to response (e.g., in a cookie or response header)
  res.cookie("CSRF-TOKEN", csrfToken, { httpOnly: false });
  next();
};

// Middleware to verify CSRF token
exports.verifyToken = (req, res, next) => {
  if (req.method !== "GET") {
    // Retrieve CSRF token from request (e.g., from cookie or request header)
    const csrfToken = req.headers["x-csrf-token"];
    // Retrieve CSRF token from session or storage mechanism
    const storedCsrfToken = req.session.csrfToken;

    // Compare CSRF tokens
    if (!csrfToken || csrfToken !== storedCsrfToken) {
      return res.status(403).json({ message: "CSRF token mismatch" });
    }
    // CSRF token is valid
  }
  next();
};

// Function to generate a random CSRF token
function generateToken() {
  return crypto.randomBytes(16).toString("hex");
}
