import bcrypt from 'bcrypt';//need to install
import jwt from 'jsonwebtoken';//need to install
import Teacher from '../models/teacherModel.js';
import Exam from '../models/examModel.js'; // Import the Exam model

// Register a teacher
export const registerTeacher = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    //hashinge the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create teh teacher record
    const teacher = await Teacher.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'Teacher registered successfully.'});
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error registering teacher.' });
  }
};

// Login a teacher
export const loginTeacher = async (req, res) => {
    console.log("Getting the email and password from req.body");
    const { email, password } = req.body;

  if (!email || !password) {
    console.log("email or password is missing");
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    console.log("Finding the teacher for given mail id");
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
        console.log("Teacher not foudn for given email");
      return res.status(404).json({ message: 'email not found.' });
    }

    console.log("Comparing the passwords");
    const isPasswordValid = await bcrypt.compare(password, teacher.password);

    console.log("checking the password valid or not");
    if (!isPasswordValid) {
        console.log("Entered password is wrong");
      return res.status(401).json({ message: 'Invalid passsword.' });
    }

    console.log("Signing the jwt token");
    const token = jwt.sign({ id: teacher._id, role: 'teacher' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    
    return res.status(200).json({ message: 'Login successful.', token });
  } catch (error) {
    res.status(500).json({ message: error.message  || 'Error logging in teacher.' });
  }
};

//get exam by logged-in teacher only
export const getExamsByLoggedInTeacher = async (req, res) => {
  const { id: teacherId } = req.user; // Teacher's ID comes from the logged-in user

  try {
    const exams = await Exam.find({ createdBy: teacherId });

    if (!exams || exams.length === 0) {
      return res.status(404).json({ error: 'No exams found for the logged-in teacher.' });
    }

    return res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error fetching exams.' });
  }
};


