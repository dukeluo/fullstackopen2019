const Phonebook = require('../models/phonebook');
const User = require('../models/user');

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

const initialUser = [
    {
        name: 'admin',
        username: 'root',
        passwordHash: 'password1234',
    }
];

const usersInDb = async () => {
    const users = await User.find({});

    return users.map(user => user.toJSON());
};

const validUserId = async () => {
    const user = await User.findOne({ username: 'root' });

    return user._id;
};

module.exports = {
    initialPhonebook,
    nonExistingId,
    invalidId,
    personsInDb,
    initialUser,
    usersInDb,
    validUserId,
};
