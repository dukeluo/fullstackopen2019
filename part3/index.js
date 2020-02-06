const express = require('express');
const bodyParser = require('body-parser')
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
let phonebook = [
    {
        name: 'Arto Hellas',
        number: '040-123456',
        id: 1,
    },
    {
        name: 'Ada Lovelace',
        number: '39-44-5323523',
        id: 4,
    },
    {
        name: 'Dan Abramov',
        number: '12-43-234345',
        id: 3,
    },
    {
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
        id: 2,
    },
];

app.use(cors());
app.use(bodyParser.json());
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use((req, res, next) => {
    req.start = Date.now();
    next();
});

app.get('/info', (req, res) => {
    res.send(`
    <p>phonebook has info for ${phonebook.length} people<p>
    <p>request start: ${new Date(req.start)}<p>
    `);
});
app.route('/api/persons')
    .get((req, res) => {
        res.json(phonebook);
    })
    .post((req, res) => {
        let person = req.body;
        let { name, number } = person;

        if (!name || !number) {
            return res.status(400).json({
                error: 'name or number missing',
            });
        }
        if (phonebook.some((person) => person.name === name)) {
            return res.status(400).json({
                error: 'name is duplicated',
            });
        }

        person.id = phonebook.length + 1;
        phonebook.push(person);
        res.json(person);
    });
app.route('/api/persons/:id')
    .get((req, res) => {
        let person = phonebook.find((person) => person.id === +req.params.id);

        if (!person) {
            return res.status(404).end();
        }
        res.json(person);
    })
    .delete((req, res) => {
        phonebook = phonebook.filter((person) => person.id !== +req.params.id);

        res.status(204).end();
    });

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
