const Phonebook = require('../models/phonebook.js');

const initialPhonebook = [
    {
        name: 'Jack',
        number: 123456789,
    },
    {
        name: 'Pony',
        number: 987654321,
    },
];

const nonExistingId = async () => {
    const person = new Phonebook({
        name: 'wang',
        number: '404',
    });

    await person.save();
    await person.remove();
    return person._id.toString();
};

const invalidId = () => '1qazsw23edcvfr45tgb';

const personsInDb = async () => {
    const persons = await Phonebook.find({});

    return persons.map(person => person.toJSON());
};

module.exports = {
    initialPhonebook,
    nonExistingId,
    invalidId,
    personsInDb,
};
