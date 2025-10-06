const request = require('supertest');
const app = require('../server');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

describe(' Quiz API testing', () => {
  beforeEach(async () => {
    await Quiz.deleteMany();
    await Question.deleteMany();
  });

  //create quiz test
  it('should create quiz', async () => {
    const res = await request(app)
      .post('/api/quizzes')
      .send({ title: `Quiz ${Date.now()}` })
      .expect(201);

    expect(res.body.quiz).toHaveProperty('_id');
    expect(res.body.quiz.title).toBeDefined();
  });

  //create question test
  it('should add single question', async () => {

    const quizRes = await request(app)
      .post('/api/quizzes')
      .send({ title: `Quiz ${Date.now()}` })
      .expect(201);

    const quizId = quizRes.body.quiz._id;

    const res = await request(app)
      .post(`/api/quizzes/${quizId}/questions`)
      .send({
        text: 'What is 2+2?',
        options: [
          { text: '3', isCorrect: false },
          { text: '4', isCorrect: true },
          { text: '5', isCorrect: false }
        ]
      })
      .expect(201);

    expect(res.body.question.text).toBe('What is 2+2?');
  });

  //add multiple question test 
  it('should add multiple questions', async () => {
    const quizRes = await request(app)
      .post('/api/quizzes')
      .send({ title: `Quiz ${Date.now()}` })
      .expect(201);

    const quizId = quizRes.body.quiz._id;

    const res = await request(app)
      .post(`/api/quizzes/${quizId}/questions/multiple`)
      .send({
        questions: [
          {
            text: 'Q1',
            options: [
              { text: 'A', isCorrect: true },
              { text: 'B', isCorrect: false }
            ]
          },
          {
            text: 'Q2',
            options: [
              { text: 'C', isCorrect: true },
              { text: 'D', isCorrect: false }
            ]
          }
        ]
      })
      .expect(201);

    expect(res.body.questions.length).toBe(2);
  });

  //get question test
  it('should get questions without correct answers', async () => {

    const quizRes = await request(app)
      .post('/api/quizzes')
      .send({ title: `Quiz ${Date.now()}` })
      .expect(201);

    const quizId = quizRes.body.quiz._id;

    await request(app)
      .post(`/api/quizzes/${quizId}/questions`)
      .send({
        text: 'Test Q',
        options: [
          { text: 'Correct', isCorrect: true },
          { text: 'Wrong', isCorrect: false }
        ]
      })
      .expect(201);

    const res = await request(app)
      .get(`/api/quizzes/${quizId}/questions`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].options[0]).not.toHaveProperty('isCorrect');
  });

  //submit quiz test and get score
  it('should calculate score correctly', async () => {
    const quizRes = await request(app)
      .post('/api/quizzes')
      .send({ title: `Quiz ${Date.now()}` })
      .expect(201);

    const quizId = quizRes.body.quiz._id;

    const questionRes = await request(app)
      .post(`/api/quizzes/${quizId}/questions`)
      .send({
        text: 'What is 2+2?',
        options: [
          { text: '3', isCorrect: false },
          { text: '4', isCorrect: true },
          { text: '5', isCorrect: false }
        ]
      })
      .expect(201);

    const questionId = questionRes.body.question._id;
    const correctOptionId = questionRes.body.question.options.find(
      opt => opt.isCorrect
    )._id;

    const res = await request(app)
      .post(`/api/quizzes/${quizId}/submit`)
      .send({
        answers: [
          {
            questionId: questionId,
            selectedOptionId: correctOptionId
          }
        ]
      })
      .expect(200);

    expect(res.body.score).toBe(1);
    expect(res.body.total).toBe(1);
  });

    //get all quiz test
  it('should get all quizzes', async () => {
    await request(app)
      .post('/api/quizzes')
      .send({ title: `Quiz ${Date.now()}` })
      .expect(201);

    const res = await request(app)
      .get('/api/quizzes')
      .expect(200);

    expect(Array.isArray(res.body.quizzes)).toBe(true);
  });
});