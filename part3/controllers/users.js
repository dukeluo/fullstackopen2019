const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.route('/')
    .post(async (req, res, next) => {
        const { body } = req;
        const { name, username, password } = body;
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const user = new User({
            name,
            username,
            passwordHash,
        });
        const savedUser = await user.save().catch(error => next(error));

        if (savedUser === undefined) {
            return;
        }
        res.status(201).json(savedUser);
    })
    .get(async (req, res) => {
        const users = await User.find({});

        res.json(users.map(u => u.toJSON()));
    });

module.exports = userRouter;
