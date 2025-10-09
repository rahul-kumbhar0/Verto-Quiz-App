````markdown
# 🎯 Verto Backend Quiz App

## 🧩 Overview

A powerful and flexible backend API for managing online quizzes — built with **Node.js**, **Express**, and **MongoDB**.  
This API allows users to create quizzes, add questions, take tests, and automatically score submissions.

---

## 📋 Features

- Create and manage quizzes with titles and questions  
- Add single or multiple questions at once  
- Hide correct answers when fetching quizzes  
- Submit answers and receive automatic scoring  
- Prevent duplicate questions  
- Perform CRUD operations on quizzes and questions  
- Comprehensive testing with **Jest** and **Supertest**

---

## 🛠️ Technology Stack

| Component | Technology |
|------------|-------------|
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Testing** | Jest + Supertest |
| **Environment Management** | dotenv |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (free tier works)
- Git installed locally

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/quiz-app-api.git](https://github.com/rahul-kumbhar0/Verto-Quiz-App.git)
   cd Verto-Quiz-App
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the root directory:

   ```
   MONGO_URI=your_mongodb_connection_string_here
   PORT=3000
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Access the API**
   The server will run at:
   👉 `http://localhost:3000`

---

## 🎯 API Endpoints

### 🧱 Quiz Management

| Method | Endpoint               | Description       |
| ------ | ---------------------- | ----------------- |
| POST   | `/api/quizzes`         | Create a new quiz |
| GET    | `/api/quizzes`         | Get all quizzes   |
| PUT    | `/api/quizzes/:quizId` | Update a quiz     |
| DELETE | `/api/quizzes/:quizId` | Delete a quiz     |

### ❓ Question Management

| Method | Endpoint                                     | Description                               |
| ------ | -------------------------------------------- | ----------------------------------------- |
| POST   | `/api/quizzes/:quizId/questions`             | Add a single question                     |
| POST   | `/api/quizzes/:quizId/questions/multiple`    | Add multiple questions                    |
| GET    | `/api/quizzes/:quizId/questions`             | Get all questions (hides correct answers) |
| PUT    | `/api/quizzes/:quizId/:questionId`           | Update a question                         |
| DELETE | `/api/quizzes/:quizId/:questionId`           | Delete a question                         |

### 🧮 Quiz Taking

| Method | Endpoint                      | Description                  |
| ------ | ----------------------------- | ---------------------------- |
| POST   | `/api/quizzes/:quizId/submit` | Submit answers and get score |

---

## 📝 Example Requests

### ➕ Create Quiz

```json
POST /api/quizzes
{
  "title": "JavaScript Basics"
}
```

### 🧠 Add Single Question

```json
POST /api/quizzes/QUIZ_ID/questions
{
  "text": "What is 2+2?",
  "options": [
    { "text": "3", "isCorrect": false },
    { "text": "4", "isCorrect": true },
    { "text": "5", "isCorrect": false }
  ]
}
```

### 🗂️ Add Multiple Questions

```json
POST /api/quizzes/QUIZ_ID/questions/multiple
{
  "questions": [
    {
      "text": "Question 1",
      "options": [
        { "text": "Option A", "isCorrect": true },
        { "text": "Option B", "isCorrect": false }
      ]
    }
  ]
}
```

### 🧾 Submit Answers

```json
POST /api/quizzes/QUIZ_ID/submit
{
  "answers": [
    {
      "questionId": "QUESTION_ID",
      "selectedOptionId": "OPTION_ID"
    }
  ]
}
```

---

## ⚙️ Key Features

### ✅ Duplicate Prevention

* Prevents adding duplicate questions to the same quiz
* Skips duplicates while continuing to process valid questions

### ✅ Bulk Question Addition

* Add multiple questions in one request
* Gracefully handles partial success scenarios

### ✅ Smart Answer Hiding

* Correct answers are hidden in responses
* Preserves quiz integrity

### ✅ Robust Error Handling

* Clear HTTP status codes: 200, 201, 400, 404, 500
* Helpful, developer-friendly error messages

### ✅ Comprehensive Testing

* Unit and integration tests for all core logic
* Edge cases and error scenarios included

---

## 🏗️ Project Structure

```
quiz-app/
├── src/
│   ├── models/
│   │   ├── Quiz.js           # Quiz schema
│   │   └── Question.js       # Question schema
│   ├── controllers/
│   │   └── quizController.js # Business logic
│   ├── routes/
│   │   └── quizRoutes.js     # API endpoints
│   └── server.js             # Main server file
├── tests/
│   └── quiz.test.js     # Unit tests
├── .env.example              # Environment example
├── package.json              # Dependencies
└── README.md                 # Documentation
```

---

## 🧪 Testing

### 🔍 API Testing

* Use **Postman** to manually test all API endpoints.

### 🧩 Unit & Integration Testing

* Run **Jest** and **Supertest** to verify functionality and logic:

  ```bash
  npm test
  ```
* Run tests in watch mode for development:

  ```bash
  npm run test:watch
  ```

---

## 🎯 Design Choices & Assumptions

### Question Design

* Each question has exactly one correct answer
* Minimum two options required per question
* Question text must be unique within each quiz

### API Design

* RESTful principles followed
* Consistent response format
* Proper use of HTTP status codes

### Security

* Sensitive data stored in environment variables
* Input validation and sanitization implemented
* Error handling without leaking internal details

### Performance

* Optimized Mongoose queries
* Lean response objects for faster performance
* Indexing considerations for scalability

---

## 🧪 Test Coverage

The test suite covers:

* Quiz creation and CRUD operations
* Single and multiple question addition
* Duplicate question prevention
* Question retrieval with hidden answers
* Scoring calculation (correct, wrong, mixed)
* Error handling scenarios

---

## ⚙️ Environment Variables for Production

```
MONGO_URI=your_production_mongodb_uri
PORT=3000
NODE_ENV=production
```

---

## 👨‍💻 Author

**Rahul Anil Kumbhar**
Computer Science Engineering Graduate
Dr. D.Y. Patil Pratisthan's College of Engineering, Kolhapur

---

## 📄 License

This project is for **educational purposes** as part of the ASE Challenge submission.

