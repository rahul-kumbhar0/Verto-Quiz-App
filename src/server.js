require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const quizRoutes = require('./routes/quizRoutes');

app.use('/api/quizzes', quizRoutes);

const dbURL = process.env.NODE_ENV === 'test'? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(dbURL)
  .then(() => console.log('Mongodb connected successfully'))
  .catch((err) => console.log('Database connection error', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

