const phonebooksRouter = require('express').Router();
const Phonebook = require('../models/phonebook');

phonebooksRouter.get('/info', async (req, res) => {
    const persons = await Phonebook.find({});

    res.send(`
    <p>phonebook has info for ${persons.length} people<p>
    <p>request start: ${new Date(req.start)}<p>
    `);
});

phonebooksRouter.route('/')
    .get(async (req, res) => {
        let persons = await Phonebook.find({});

        res.json(persons.map(person => person.toJSON()));
    })
    .post(async (req, res, next) => {
        let person = req.body;
        let { name, number } = person;
        let persons = await Phonebook.find({});

        if (name && persons.some((person) => person.name === name.toString())) {
            return res.status(400).json({
                error: 'name is duplicated',
            });
        }

        let newPerson = new Phonebook({ name, number });
        let savedPerson = await newPerson.save()
            .catch(error => next(error));

        if (savedPerson === undefined) {
            return;
        }
        res.status(201).json(savedPerson.toJSON());
    });

phonebooksRouter.route('/:id')
    .get(async (req, res, next) => {
        let person = await Phonebook.findById(req.params.id)
            .catch(error => next(error));

        if (person === undefined) {
            return;
        }
        if (person === null) {
            return res.status(404).end();
        }
        res.json(person.toJSON());
    })
    .delete(async (req, res, next) => {
        let deletedPerson = await Phonebook.findByIdAndRemove(req.params.id)
            .catch(error => next(error));

        if (deletedPerson === undefined) {
            return;
        }
        if (deletedPerson === null) {
            return res.status(404).end();
        }
        res.status(204).end();
    })
    .put(async (req, res, next) => {
        let body = req.body;
        let { name, number } = body;
        let person = { name, number };
        let updatedPerson = await Phonebook.findByIdAndUpdate(req.params.id, person, { new: true })
            .catch(error => next(error));

        if (updatedPerson === undefined) {
            return;
        }
        if (updatedPerson === null) {
            return res.status(404).end();
        }
        res.json(updatedPerson.toJSON());
    });

module.exports = phonebooksRouter;
