const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const User = require('../models/user');
const Phonebook = require('../models/phonebook');
const api = supertest(app);

beforeEach(async () => {
    await Phonebook.deleteMany({});
    await Promise.all(helper.initialPhonebook.map(u => new Phonebook(u).save()));
    const initialPersons = await helper.personsInDb();
    await User.deleteMany({});
    for (let user of helper.initialUser) {
        user.persons = initialPersons.map(p => p.id);
        await new User(user).save();
    }
});

describe('when there is initially a user', () => {
    test('user are returned as json ', async (done) => {
        const { status, header } = await api.get('/api/users');

        expect(status).toBe(200);
        expect(header['content-type']).toContain('application/json');
        done();
    });

    test('all users are returned', async (done) => {
        const { body } = await api.get('/api/users');

        expect(body.length).toBe(helper.initialUser.length);
        done();
    });

    test('a specific user is within the returned users', async (done) => {
        const { body } = await api.get('/api/users');
        const usernames = body.map(u => u.username);
        const personNames = body[0].persons.map(p => p.name);
        const personNumbers = body[0].persons.map(p => p.number);

        expect(usernames).toContain(helper.initialUser[0].username);
        expect(personNames).toEqual(helper.initialPhonebook.map(p => p.name));
        expect(personNumbers).toEqual(helper.initialPhonebook.map(p => p.number));
        done();
    });

    describe('adding a fresh user', () => {
        test('succeeds with a valid user', async (done) => {
            const userAtStart = await helper.usersInDb();
            const user = {
                name: 'Jane Smith',
                username: 'janes',
                password: 'abc',
            };
            await api.post('/api/users').send(user).expect(201);
            const userAtEnd = await helper.usersInDb();
            const usernames = userAtEnd.map(u => u.username);

            expect(userAtEnd.length).toBe(userAtStart.length + 1);
            expect(usernames).toContain(user.username);
            done();
        });

        test('fails with statuscode 400 and message when username is already existed', async (done) => {
            const userAtStart = await helper.usersInDb();
            const user = {
                name: 'Jane Smith',
                username: 'root',
                password: 'abc',
            };
            const { status, body } = await api.post('/api/users').send(user).expect(400);
            const userAtEnd = await helper.usersInDb();

            expect(status).toBe(400);
            expect(body.error).toContain('`username` to be unique');
            expect(userAtEnd.length).toBe(userAtStart.length);
            done();
        });
    });
});

afterAll(() => {
    mongoose.connection.close();
});