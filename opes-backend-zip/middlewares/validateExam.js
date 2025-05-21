const MAX_DURATION = 3 * 60 * 60;

const validateExam = (req, res, next) => {
  const { title, description, duration, startTime, endTime, questions, randomizeQuestionSequence, showResult, passingScore } = req.body;

  const start = new Date(startTime);
  const end = new Date(endTime);
  const windowDuration = Math.floor((end - start) / 1000); // in seconds

  try {
    // Validate required fields
    if (!title || !description || !startTime || !endTime) {
      throw new Error('All fields (title, description, date, startTime, and endTime) are required.');
    }

    if (start >= end) {
      throw new Error('The startTime must be earlier than the endTime.');
    }

    if (duration > MAX_DURATION) {
      throw new Error("Duration must not exceed 3 hours.");
    }

    if (duration > windowDuration) {
      throw new Error("Duration exceeds the allowed exam window.");
    }

    if (typeof randomizeQuestionSequence !== 'boolean') {
      throw new Error('randomizeQuestionSequence must be a boolean value.');
    }

    if (typeof showResult !== 'boolean') {
      throw new Error('showResult must be a boolean value.');
    }

    if (typeof passingScore !== 'number' || passingScore < 0) {
      throw new Error('Passing score must be a non-negative number.');
    }

    if (!questions || questions.length === 0) {
      throw new Error('An exam must have at least one question.');
    }

    // Validate each question
    questions.forEach((question, index) => {
      if (!question.type || !['mcq', 'essay'].includes(question.type)) {
        throw new Error(`Question ${index + 1} must have a valid type: \"mcq\" or \"essay\".`);
      }

      if (question.type === 'essay' && !question.question) {
        throw new Error(`Text is required for descriptive question ${index + 1}.`);
      }

      if (question.type === 'image-based' && !question.image) {
        throw new Error(`Image URL is required for image-based question ${index + 1}.`);
      }

      if (question.options && question.options.length !== 4) {
        throw new Error(`Question ${index + 1} must have exactly 4 options for multiple-choice questions.`);
      }

      if (question.type !== 'essay' && !question.correctAnswer) {
        throw new Error(`Correct answer for question ${index + 1} must be a number between 1 and 4.`);
      }
    });

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    console.log(error.message);
    
    res.status(400).json({ error: error.message });
  }
};

export const validateUpdateExam = (req, res, next) => {
  const { title, description, startTime, duration, endTime, randomizeQuestionSequence, questions, showResult, passingScore } = req.body;

  const start = new Date(startTime);
  const end = new Date(endTime);
  const windowDuration = Math.floor((end - start) / 1000); // in seconds
  try {
    // Validate required fields
    if (!title || !description || !startTime || !endTime) {
      throw new Error('All fields (title, description, date, startTime, and endTime) are required.');
    }

    if (start >= end) {
      throw new Error('The startTime must be earlier than the endTime.');
    }

    if (duration > MAX_DURATION) {
      throw new Error("Duration must not exceed 3 hours.");
    }

    if (duration > windowDuration) {
      throw new Error("Duration exceeds the allowed exam window.");
    }

    if (typeof randomizeQuestionSequence !== 'boolean') {
      throw new Error('randomizeQuestionSequence must be a boolean value.');
    }

    if (typeof showResult !== 'boolean') {
      throw new Error('showResult must be a boolean value.');
    }

    if (typeof passingScore !== 'number' || passingScore < 0) {
      throw new Error('Passing score must be a non-negative number.');
    }

    if (!questions || questions.length === 0) {
      throw new Error('An exam must have at least one question.');
    }

    // Validate each question
    questions.forEach((question, index) => {
      if (!question.type || !['mcq', 'essay'].includes(question.type)) {
        throw new Error(`Question ${index + 1} must have a valid type: \"mcq\" or \"essay\".`);
      }

      if (question.type === 'essay' && !question.question) {
        throw new Error(`Text is required for descriptive question ${index + 1}.`);
      }

      if (question.type === 'image-based' && !question.image) {
        throw new Error(`Image URL is required for image-based question ${index + 1}.`);
      }

      if (question.options && question.options.length !== 4) {
        throw new Error(`Question ${index + 1} must have exactly 4 options for multiple-choice questions.`);
      }

      if (question.type !== 'essay' && !question.correctAnswer) {
        throw new Error(`Correct answer for question ${index + 1} must be a number between 1 and 4.`);
      }
    });
    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    console.log(error.message);
    
    res.status(400).json({ error: error.message });
  }
};

export default validateExam;