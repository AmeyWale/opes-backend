const validateStudent = (req, res, next) => {
  const {uniqueId, name, branch, class: studentClass, yearOfStudy, email, phoneNumber, collegeName } = req.body;

  try {
    // Validating required fields
    if (!uniqueId || !name || !branch || !studentClass || !yearOfStudy || !email || !phoneNumber || !collegeName) {
      throw new Error('All fields are required: uniqueId, name, branch, class, yearOfStudy, email, phoneNumber, and collegeName.');
    }

    // Validating data types and values
    if (typeof uniqueId !== 'string' || uniqueId.trim().length === 0) {
      throw new Error('Unique ID must be a non-empty string.');
    }

    if (typeof name !== 'string' || name.trim().length === 0 || !/^[a-zA-Z\s]+$/.test(name)) {
      throw new Error('Name must be a non-empty string containing only letters and spaces.');
    }

    if (typeof branch !== 'string' || branch.trim().length === 0) {
      throw new Error('Branch must be a non-empty string.');
    }

    if (typeof studentClass !== 'string' || studentClass.trim().length === 0) {
      throw new Error('Class must be a non-empty string.');
    }

    if (!['1', '2', '3', '4', '5'].includes(yearOfStudy)) {
      throw new Error('Year of Study must be a valid value (1, 2, 3, 4, or 5).');
    }

    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Email must be a valid email address.');
    }

    if (typeof phoneNumber !== 'string' || !/^\d{10}$/.test(phoneNumber)) {
      throw new Error('Phone Number must be a 10-digit number.');
    }

    if (typeof collegeName !== 'string' || collegeName.trim().length === 0) {
      throw new Error('College Name must be a non-empty string.');
    }

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export default validateStudent;
