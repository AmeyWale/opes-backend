import jwt from 'jsonwebtoken';
import Teacher from '../models/teacherModel.js';

export const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export const isTeacher = async (req, res, next) => {
    try {
      const teacher = await Teacher.findById(req.user.id);
  
      if (!teacher) {
        return res.status(403).json({ message: 'Access denied. Teacher role required.' });
      }
  
      next();
    } catch (error) {
      res.status(500).json({ message: error.message || 'Error verifying teacher role.' });
    }
  };

