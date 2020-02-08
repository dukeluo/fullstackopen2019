require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const morgan = require('morgan');
const cors = require('cors');
const Phonebook = require('./models/phonebook');

const app = express();
const PORT = process.env.PORT;

const requestStart = (req, res, next) => {
    req.start = Date.now();
    next();
};
const unknownEndpoint = (req, res) => res.status(404).send({ error: 'unknown endpoint' });
const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).send({ error: 'malformed id' });
    }
    next(error);
};

app.use(cors());
app.use(bodyParser.json());
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(requestStart);

app.get('/info', async (req, res) => {
    const persons = await Phonebook.find({});

    res.send(`
    <p>phonebook has info for ${persons.length} people<p>
    <p>request start: ${new Date(req.start)}<p>
    `);
});
app.route('/api/persons')
    .get(async (req, res) => {
        let persons = await Phonebook.find({});

        res.json(persons.map(person => person.toJSON()));
    })
    .post(async (req, res) => {
        let person = req.body;
        let { name, number } = person;
        let persons = await Phonebook.find({});

        if (!name || !number) {
            return res.status(400).json({
                error: 'name or number missing',
            });
        }
        if (persons.some((person) => person.name === name)) {
            return res.status(400).json({
                error: 'name is duplicated',
            });
        }

        let newPerson = new Phonebook({ name, number });
        let savedPerson = await newPerson.save();

        res.status(201).json(savedPerson.toJSON());
    });
app.route('/api/persons/:id')
    .get(async (req, res, next) => {
        let person = await Phonebook.findById(req.params.id).catch(error => next(error));

        if (person === undefined) {
            return ;
        }
        if (person === null) {
            return res.status(404).end();
        }
        res.json(person.toJSON());
    })
    .delete(async (req, res, next) => {
        let deletedPerson = await Phonebook.findByIdAndRemove(req.params.id).catch(error => next(error));

        if (deletedPerson === undefined) {
            return ;
        }
        if (deletedPerson === null) {
            return res.status(404).end();
        }
        res.status(204).end();
    });

app.use(unknownEndpoint);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
