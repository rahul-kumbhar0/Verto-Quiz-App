const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// to create quiz
router.post('/', quizController.createQuiz);
//to add question on quiz
router.post('/:quizId/questions', quizController.addQuestion);
//to fetech the question 
router.get('/:quizId/questions', quizController.getQuestionForQuiz);
//submit the quiz
router.post('/:quizId/submit', quizController.submitQuiz);
//delete quiz
router.delete('/:quizId', quizController.deleteQuiz);
//delete question
router.delete('/:quizId/:questionId', quizController.deleteQuestion);
//to get all quiz
router.get('/', quizController.getAllQuiz);
//to update the quiz
router.put('/:quizId', quizController.updateQuiz);
//to update the question
router.put('/:quizId/:questionId', quizController.updateQuestion)

router.post('/:quizId/questions/multiple', quizController.addMultipleQuestion);

module.exports = router;