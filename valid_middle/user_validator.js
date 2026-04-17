const validateCreateUser = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  // Username
  const nameRegex = /^[A-Za-z0-9]+$/;
  if (!username || username.trim() === "") {
    errors.push({ field: "username", msg: "Username is required" });
  } else if (username.trim().length < 3 || username.trim().length > 30) {
    errors.push({ field: "username", msg: "Username must be 3–30 characters" });
  } else if (!nameRegex.test(username)) {
    errors.push({ field: "username", msg: "special characters and spaces not allowed in name" });
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.trim() === "") {
    errors.push({ field: "email", msg: "Email is required" });
  } else if (!emailRegex.test(email)) {
    errors.push({ field: "email", msg: "Must be a valid email" });
  }

  // Password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])[^\s]+$/;
  if (!password || password === "") {
    errors.push({ field: "password", msg: "Password is required" });
  } else if (password.length < 8) {
    errors.push({ field: "password", msg: "Password must be at least 8 characters" });
  } else if (!passwordRegex.test(password)) {
    errors.push({ field: "password", msg: "Password must contain at least one uppercase letter, one lowercase letter, one special character, and must not contain spaces." });
  }

  // If errors exist, stop here
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next(); // All good, proceed to controller
};

const validateUserId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id) || parseInt(id) <= 0) {
    return res.status(400).json({ errors: [{ field: "id", msg: "ID must be a valid positive number" }] });
  }
  next();
};

const validateloginuser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });


  next();
}

module.exports = { validateCreateUser, validateUserId, validateloginuser };