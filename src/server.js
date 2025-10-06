require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const quizRoutes = require('./routes/quizRoutes');

app.use('/api/quizzes', quizRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI )
  .then(() => console.log('Mongodb connected successfully'))
  .catch((err) => console.log('Database connection error', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;