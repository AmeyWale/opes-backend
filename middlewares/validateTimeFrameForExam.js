import Exam from '../models/examModel.js';

const validateTimeFrameForExam = async (req, res, next) => {
  const { assessmentId } = req.body;

  try {
    const exam = await Exam.findOne({ assessmentId });

    if (!exam) {
      return res.status(404).json({ status: 'error', message: 'Invalid Assessment ID.' });
    }

    const currentTime = new Date();

    if (currentTime < exam.examStartDateTime || currentTime > exam.examEndDateTime) {
      return res.status(400).json({
        status: 'error',
        message: 'You can only register for this exam during the allowed time frame.',
      });
    }

    // Proceed if within the time frame
    next();
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export default validateTimeFrameForExam;
