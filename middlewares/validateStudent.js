const validateStudent = (req, res, next) => {
    const { uniqueId, name, branch, class: studentClass, yearOfStudy, email, phoneNumber, collegeName } = req.body;
    
    if (!uniqueId || !name || !branch || !studentClass || !yearOfStudy || !email || !phoneNumber || !collegeName) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required',
      });
    }
  
    next();
  };
  
  module.exports = validateStudent;
  