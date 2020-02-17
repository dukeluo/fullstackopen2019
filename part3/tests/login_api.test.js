const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const api = supertest(app);

beforeAll(async () => {
    await api.post('/api/users').send({
        name: 'test',
        username: 'user',
        password: 'pwd',
    });
});

describe('when there is initially a user', () => {
    describe('logining the user', () => {
        test('succeeds with a valid username and password', async (done) => {
            const { body, status } = await api.post('/api/login').send({
                username: 'user',
                password: 'pwd',
            });

            expect(status).toBe(200);
            expect(body.username).toBe('user');
            expect(body.name).toBe('test');
            expect(body.token).not.toBeUndefined();
            done();
        });

        test('fails with invalid username', async (done) => {
            const { body, status } = await api.post('/api/login').send({
                username: 'wrong',
                password: 'pwd',
            });

            expect(status).toBe(401);
            expect(body).toMatchObject({
                error: 'invalid username or password',
            });
            done();
        });

        test('fails with invalid password', async (done) => {
            const { body, status } = await api.post('/api/login').send({
                username: 'user',
                password: 'wrong',
            });

            expect(status).toBe(401);
            expect(body).toMatchObject({
                error: 'invalid username or password',
            });
            done();
        });
    });
});

afterAll(() => {
    mongoose.connection.close();
});
