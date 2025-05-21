import express from 'express';
import { handleCamFeed,handleViolation } from '../controllers/proctorController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const proctorRouter = express.Router();

// Flow
// First is validation via middleware
// Controller
// Service

proctorRouter.post("/feed",handleCamFeed)
proctorRouter.post("/violations",isAuthenticated, handleViolation);

export default proctorRouter;