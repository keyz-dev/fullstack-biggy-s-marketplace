const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes/index');

const app = express();

// for middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

// for middleware Error handler
// app.use(errorHandler)

module.exports = app;
