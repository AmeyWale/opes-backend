import Exam from '../models/examModel.js'
import Student from '../models/studentModel.js';//importing student model 

// Create an Exam
export const createExam = async (req, res) => {
  const { title, description, date, startTime, endTime, duration, questions, createdBy, randomizeQuestionSequence, showResult, passingScore } = req.body;

  try {
    if (!title || !description || !date || !startTime || !endTime || !createdBy) {
      return res
        .status(400)
        .json({ error: 'All fields (title, description, date, startTime, endTime, createdBy) are required.' });
    }

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'The startTime must be earlier than the endTime.' });
    }

    if (typeof randomizeQuestionSequence !== 'boolean') {
      return res.status(400).json({ error: 'randomizeQuestionSequence must be a boolean value.' });
    }

    if (typeof showResult !== 'boolean') {
      return res.status(400).json({ error: 'showResult must be a boolean value.' });
    }

    if (typeof passingScore !== 'number' || passingScore < 0) {
      return res.status(400).json({ error: 'Passing score must be a non-negative number.' });
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
      startTime,
      endTime,
      // duration,
      randomizeQuestionSequence: randomizeQuestionSequence || false,
      showResult: showResult || false,
      passingScore,
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
  console.log("Getting all exams");
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

    const examObjectId = exam._id;

    // Ensure the current time is within the exam time frame
    const currentTime = new Date();
    if (currentTime > exam.examEndDateTime) {
      return res.status(400).json({ error: 'Exam submission time has passed.' });
    }

    // Ensuring the student is registered for this assessment
    const student = await Student.findOne({ assessmentId: examObjectId, _id: studentId });
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
    const passed = totalMarks >= exam.passingScore;

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
      passed,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get Exam Analytics 
export const getExamAnalytics = async (req, res) => {
  const { assessmentId } = req.params;

  try {
    const exam = await Exam.findOne({ assessmentId });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    // Total students registered for this exam
    const allStudents = await Student.find({ assessmentId: exam._id });
    const totalStudents = allStudents.length;

    // Students who submitted (in responses[])
    const submissions = exam.responses || [];
    const totalSubmissions = submissions.length;

    const passingScore = exam.passingScore;

    // Compute pass count and average
    let passCount = 0;
    let totalMarksSum = 0;

    const submissionDetails = await Promise.all(
      submissions.map(async (response) => {
        const student = await Student.findById(response.studentId);
        const isPassed = response.totalMarks >= passingScore;

        totalMarksSum += response.totalMarks;
        if (isPassed) passCount++;

        return {
          name: student?.name || 'Unknown',
          score: response.totalMarks,
          status: isPassed ? 'Passed' : 'Failed',
          submissionTime: student?.updatedAt || null,
        };
      })
    );

    const averageScore = totalSubmissions ? (totalMarksSum / totalSubmissions).toFixed(2) : 0;
    const submissionRate = totalStudents ? ((totalSubmissions / totalStudents) * 100).toFixed(2) : 0;
    const passRate = totalSubmissions ? ((passCount / totalSubmissions) * 100).toFixed(2) : 0;

    const result = {
      examInfo: {
        title: exam.title,
        date: exam.date,
        startTime: exam.startTime,
        endTime: exam.endTime,
      },
      statistics: {
        totalStudents,
        totalSubmissions,
        passedStudents: passCount,
        averageScore: Number(averageScore),
      },
      overview: {
        submissionRate: `${submissionRate}%`,
        passRate: `${passRate}%`,
      },
      submissions: submissionDetails,
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching exam analytics:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};