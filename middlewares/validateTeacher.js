const validateTeacher = (req, res, next) => {
  const { fullName, email, password } = req.body;

  try {
    
    // Validate required fields
    if (!fullName || !email || !password) {
      throw new Error('All fields (fullName, email, and password) are required.');
    }

    // Validate fullName
    if (typeof fullName !== 'string' || fullName.trim().length === 0 || !/^[a-zA-Z\s]+$/.test(fullName)) {
      throw new Error('Full Name must be a non-empty string containing only letters and spaces.');
    }

    // Validate email
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Email must be a valid email address.');
    }

    // Validate password
    if (typeof password !== 'string' || password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter.');
    }
    if (!/[a-z]/.test(password)) {
      throw new Error('Password must contain at least one lowercase letter.');
    }
    if (!/[0-9]/.test(password)) {
      throw new Error('Password must contain at least one digit.');
    }
    if (!/[@$!%*?&#]/.test(password)) {
      throw new Error('Password must contain at least one special character (@, $, !, %, *, ?, &, #).');
    }

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export default validateTeacher;
