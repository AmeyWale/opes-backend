import Exam from '../models/examModel.js'
import Student from '../models/studentModel.js';//importing student model 

// Create an Exam
export const createExam = async (req, res) => {
  const { title, description, date, startTime, endTime, questions, randomizeQuestionSequence, showResult, passingScore } = req.body;

  const createdBy = req.user.id;

  try {
    const exam = await Exam.create({
      title,
      description,
      date,
      startTime,
      endTime,
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
  // const { role, id: userId } = req.user;

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
        const { correctAnswer, ...rest } = question.toObject();
        return rest; // Exclude correctAnswer for students
      }),
    };
    // console.log(sanitizedExam);
    
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
  const { assessmentId, answers, uniqueId } = req.body;
  
  if (!assessmentId || !uniqueId) {
    return res.status(400).json({ message: 'Assessment ID and uniqueId are required.' });
  }

  try {
    const exam = await Exam.findOne({ assessmentId });

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found.' });
    }

    const examObjectId = exam._id;

    // Ensure the current time is within the exam time frame
    const currentTime = new Date();
    if (currentTime > exam.examEndDateTime) {
      return res.status(400).json({ message: 'Exam submission time has passed.' });
    }

    // Ensuring the student is registered for this assessment
    const student = await Student.findOne({ assessmentId: examObjectId, _id: studentId });
    if (!student) {
      return res.status(403).json({ message: 'Student is not registered for this assessment.' });
    }

    // Check if the student has already submitted the exam
    // NEED DIFFERENT LOGIC FOR THIS
    // const existingResponse = exam.responses.find(
    //   (response) => response.studentId.toString() === studentId.toString()
    // );

    // if (existingResponse) {
    //   return res.status(400).json({ error: 'Student has already submitted the exam.' });
    // }    


    let totalCorrect = 0;
    const processedAnswers = Object.entries(answers).map(([questionId, studentAnswer]) => {
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

    // exam.responses.push({
    //   studentId,
    //   answers: processedAnswers,
    //   totalCorrect,
    //   totalMarks,
    // });

    // await exam.save();

    // Update the Student document
    const updatedStudent = await Student.findOneAndUpdate(
      { uniqueId, examId:exam._id }, // Find the student for this assessment
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
    res.status(500).json({ message: error.message });
  }
};

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