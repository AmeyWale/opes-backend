const validateExam = (req, res, next) => {
  const { title, description, startTime, endTime, questions, randomizeQuestionSequence, showResult, passingScore } = req.body;

  try {
    // Validate required fields
    if (!title || !description || !startTime || !endTime) {
      throw new Error('All fields (title, description, date, startTime, and endTime) are required.');
    }

    if (new Date(startTime) >= new Date(endTime)) {
      throw new Error('The startTime must be earlier than the endTime.');
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