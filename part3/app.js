const config = require('./utils/config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const phonebooksRouter = require('./controllers/phonebooks');
const middleware = require('./utils/middleware');
const app = express();

console.log('connecting to', config.MONGODB_URL);
mongoose.connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(result => {
    console.log('connected to MongoDB');
}).catch(error => {
    console.log('error connecting to MongoDB:', error.message);
});

app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());
app.use(middleware.requestLogger());
app.use(middleware.startRequest);

app.use('/api/persons', phonebooksRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
