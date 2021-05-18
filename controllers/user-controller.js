const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
    let foundUsers;
    try {
        foundUsers = await User.find({}, '-password');
    } catch (err) {
        return next(
            new HttpError('Fetching users failed, please try again', 500)
        );
    }

    res.json({ users: foundUsers.map(u => u.toObject({ getters: true })) });
}

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid input passed, please check values', 422)
        );
    }

    const { name, email, password, codeBlocks } = req.body;

    let hasUser;
    try {
        hasUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    if (hasUser) {
        return next(
            new HttpError('Could not create user, email already exists.', 422)
        );
    }

    const createdUser = new User({
        name,
        email,
        image: 'https://unsplash.com/photos/YcZWg9FcBF4',
        password,
        codeBlocks
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Creating user failed, please try again later.',
            500
        );
        return next(error);
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let identifiedUser;
    try {
        identifiedUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Login failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!identifiedUser || identifiedUser.password !== password) {
        return next(
            new HttpError('No users found, credentials seems to be wrong.', 401)
        );
    }

    res.json({ message: 'Login Successfull!' });
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;