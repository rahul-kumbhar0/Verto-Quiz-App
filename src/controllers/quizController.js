const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

//create quiz
exports.createQuiz = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || title.trim().length === 0) {
            return res.status(400).json({  // Changed from 500 to 400
                message: 'Title is required'
            });
        }
        const quiz = new Quiz({ title: title.trim() });
        await quiz.save();

        res.status(201).json({
            message: 'Quiz created Successfully',
            quiz
        });
    } catch (error) {
        console.error('Create Quiz error', error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};



//add question to quiz
exports.addQuestion = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { text, options } = req.body;

        // Validate inputs
        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                message: 'Question text are required'
            });
        }

        if (!options || options.length < 2) {
            return res.status(400).json({
                message: "At least two options are required"
            })
        }

        // Check if quiz exists
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const questionExists = await Question.findOne({ quizId, text: text.trim() });
        if (questionExists) {
            return res.status(400).json({
                message: "Question already exists in this quiz"
            })
        }



        // Validate options format
        const validOptions = options.map(option => ({
            text: option.text?.trim(),
            isCorrect: option.isCorrect === true
        }));

        const correctCount = validOptions.filter(opt => opt.isCorrect).length;
        if (correctCount !== 1) {
            return res.status(400).json({
                message: 'Exactly one option must be correct'
            });
        }

        const question = new Question({
            quizId,
            text: text.trim(),
            options: validOptions
        });

        await question.save();

        res.status(201).json({
            message: 'Question added successfully',
            question
        });
    } catch (error) {
        console.error('Add Question Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//get all question for quiz
exports.getQuestionForQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quizExists = await Quiz.findById(quizId);

        if (!quizExists) {
            return res.status(404).json({
                message: "Quiz not found"
            })
        }

        const questions = await Question.find({ quizId })
            .select('-options.isCorrect')
            .lean();

        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};

//submit answer and calculate the score
exports.submitQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { answers } = req.body;

        if (!Array.isArray(answers)) {
            return res.status(400).json({
                message: 'Answers must be in the array'
            });
        }

        const questions = await Question.find({ quizId });

        let score = 0;

        // Loop through submitted answers
        for (const answer of answers) {
            const { questionId, selectedOptionId } = answer;

            // Find matching question
            const question = questions.find(q =>
                q._id.toString() === questionId
            );

            if (!question) continue;

            // Find selected option
            const selectedOption = question.options.find(opt =>
                opt._id.toString() === selectedOptionId
            );

            // If correct, increment score
            if (selectedOption && selectedOption.isCorrect) {
                score++;
            }
        }
        res.json({
            score,
            total: questions.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

//delete the question 
exports.deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await Question.findByIdAndDelete(questionId);
        if (!question) {
            return res.status(404).json({
                message: "Question not found"
            })
        }
        res.status(200).json({
            message: "Question deleted successfully",
            question
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
};


//delete the quiz

exports.deleteQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            })
        }
        await Quiz.findByIdAndDelete(quizId);
        await Question.deleteMany({ quizId });

        res.status(200).json({
            message: "Quiz deleted successfully",
            quiz
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
};


//get all quiz
exports.getAllQuiz = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        if (!quizzes) {
            return res.status(404).json({
                message: "Quizzes not found"
            })
        }
        res.status(200).json({
            message: "Quizzed fetched successfully",
            quizzes
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
};



//update the question 
exports.updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { text, options } = req.body;
        const question = await Question.findByIdAndUpdate(questionId);


        if (!question) {
            return res.status(404).json({
                message: "Question not found"
            });
        };

        if (!text && !options) {
            return res.status(400).json({
                message: "Text and options are required"
            });
        };

        if (text) question.text = text.trim();
        if (options) question.options = options;

        await question.save();
        res.status(200).json({
            message: "Question updated successfully",
            question
        })

    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}


//update the quiz
exports.updateQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { title } = req.body;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            })
        }

        if (title) quiz.title = title.trim();
        await quiz.save();
        res.status(200).json({
            message: "Quiz updated successfully",
            quiz
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}


exports.addMultipleQuestion = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { questions } = req.body;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            })
        }
        //check questions array
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                message: "Question must be in the array"
            })
        }

        const newQuestion = [];
        for (let questionData of questions) {
            if (!questionData.text || questionData.options.length < 2) {
                return res.status(400).json({
                    message: "Each question must have text and at least two options"
                })
            }

            let correctCount = 0;
            const validOptions = questionData.options.filter(opt => {
                if (opt.isCorrect) correctCount++;
                return {
                    text: opt.text?.trim(),
                    isCorrect: opt.isCorrect === true
                };
            });

            const questionExists = await Question.findOne({quizId, text: questionData.text.trim()});
            if(questionExists){
                return res.status(400).json({
                    message: "Question already exists in this quiz"
                })
            }
            if (correctCount !== 1) {
                return res.status(400).json({
                    message: "Each question must have exactly one correct option"
                })
            }

            //create question
            const question = new Question({
                quizId: quizId,
                text: questionData.text,
                options: validOptions
            })
            await question.save();
            newQuestion.push(question);
        }
        res.status(201).json({
            message: "Questions added successfully",
            questions: newQuestion
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}
