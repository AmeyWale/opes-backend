import express from 'express';
// import { validateCamFeed } from '../middlewares/validateCamFeed.js';
import { handleCamFeed } from '../controllers/proctorController.js';

const proctorRouter = express.Router();

// Flow
// First is validation via middleware
// Controller
// Service

proctorRouter.post("/feed",handleCamFeed)

export default proctorRouter;