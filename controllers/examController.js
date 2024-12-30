import Exam from '../models/Exam'; // Import the Exam model
import Student from '../models/studentModel';//importing student model 

// Create an Exam
export const createExam = async (req, res) => {
  const { title, description, date, duration, questions, createdBy } = req.body;

  try {
    if (!title || !description || !date || !duration || !createdBy) {
      return res
        .status(400)
        .json({ error: 'All fields (title, description, date, duration, createdBy) are required.' });
    }

    if (!questions || questions.length === 0) {
      return res.status(400).json({ error: 'An exam must have at least one question.' });
    }

    questions.forEach((question) => {
      if (!question.type || !['descriptive', 'image-based'].includes(question.type)) {
        throw new Error('Each question must have a valid type: "descriptive" or "image-based".');
      }

      if (question.type === 'descriptive' && !question.text) {
        throw new Error('Text is required for descriptive questions.');
      }

      if (question.type === 'image-based' && !question.image) {
        throw new Error('Image URL is required for image-based questions.');
      }

      if (question.options && question.options.length !== 4) {
        throw new Error('A question must have exactly 4 options for multiple-choice questions.');
      }

      if (question.correctAnswer && (question.correctAnswer < 1 || question.correctAnswer > 4)) {
        throw new Error('Correct answer must be a number between 1 and 4.');
      }
    });

    const exam = await Exam.create({
      title,
      description,
      date,
      duration,
      questions,
      createdBy,
    });

    return res.status(201).json({
      exam,
      message: `Exam created successfully with Assessment ID: ${exam.assessmentId}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch an Exam by Assessment ID
export const getExamByAssessmentId = async (req, res) => {
  const { assessmentId } = req.params;
  const { role, id: userId } = req.user;

  if (!assessmentId) {
    return res.status(400).json({ error: 'Assessment ID is required.' });
  }

  try {
    const exam = await Exam.findOne({ assessmentId });

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found.' });
    }

    const sanitizedExam = {
      ...exam.toObject(),
      questions: exam.questions.map((question) => {
        if (role === 'student') {
          const { correctAnswer, ...rest } = question;
          return rest; // Exclude correctAnswer for students
        }
        return question; // Include all details for teachers
      }),
    };

    return res.status(200).json(sanitizedExam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch All Exams
export const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    return res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an Exam
export const updateExam = async (req, res) => {
  const { assessmentId } = req.params;
  const updateData = req.body;

  try {
    const exam = await Exam.findOneAndUpdate({ assessmentId }, updateData, { new: true });

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found.' });
    }

    return res.status(200).json({
      exam,
      message: 'Exam updated successfully.',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an Exam
export const deleteExam = async (req, res) => {
  const { assessmentId } = req.params;

  try {
    const exam = await Exam.findOneAndDelete({ assessmentId });

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found.' });
    }

    return res.status(200).json({
      message: 'Exam deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit Exam Response
export const submitExamResponse = async (req, res) => {
  const { assessmentId, answers } = req.body;
  const { id: studentId } = req.user;

  if (!assessmentId || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Assessment ID and answers are required.' });
  }

  try {
    const exam = await Exam.findOne({ assessmentId });

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found.' });
    }

    // Ensure the current time is within the exam time frame
    const currentTime = new Date();
    if (currentTime > exam.examEndDateTime) {
      return res.status(400).json({ error: 'Exam submission time has passed.' });
    }

    // Ensuring the student is registered for this assessment
    const student = await Student.findOne({ assessmentId, _id: studentId });
    if (!student) {
      return res.status(403).json({ error: 'Student is not registered for this assessment.' });
    }

    // Check if the student has already submitted the exam
    const existingResponse = exam.responses.find(
      (response) => response.studentId.toString() === studentId.toString()
    );

    if (existingResponse) {
      return res.status(400).json({ error: 'Student has already submitted the exam.' });
    }    


    let totalCorrect = 0;
    const processedAnswers = answers.map(({ questionId, studentAnswer }) => {
      const question = exam.questions.id(questionId);

      if (!question) {
        throw new Error(`Question ID ${questionId} not found in exam.`);
      }

      const isCorrect = question.correctAnswer === studentAnswer;
      if (isCorrect) totalCorrect += 1;

      return { questionId, studentAnswer, isCorrect };
    });

    const totalMarks = totalCorrect; // Customize scoring logic if needed

    exam.responses.push({
      studentId,
      answers: processedAnswers,
      totalCorrect,
      totalMarks,
    });

    await exam.save();

    // Update the Student document
    const updatedStudent = await Student.findOneAndUpdate(
      { uniqueId: studentId, assessmentId }, // Find the student for this assessment
      {
        $set: {
          answers: processedAnswers,
          totalMarks,
          totalCorrect,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student record not found for this assessment.' });
    }

    return res.status(200).json({
      message: 'Response submitted successfully.',
      totalCorrect,
      totalMarks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

