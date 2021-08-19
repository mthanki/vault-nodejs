const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        console.log(errors);
        return next(
            new HttpError('Invalid input passed, please check values', 422)
        );
    }

    const { name, email, password } = req.body;

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

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        console.log(err);
        const error = new HttpError('Could not create user, please try again.', 500);
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        image: 'https://unsplash.com/photos/YcZWg9FcBF4',
        password: hashedPassword,
        codeBlocks: []
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

    let token;
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Creating user failed, please try again later.',
            500
        );
        return next(error);
    }

    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
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

    if (!identifiedUser) {
        return next(
            new HttpError('No users found, credentials seems to be wrong.', 401)
        );
    }

    let isValidPassword;
    try {
        isValidPassword = await bcrypt.compare(password, identifiedUser.password);
    } catch (err) {
        const error = new HttpError('Login failed, please try again.', 500);
        return next(error);
    }

    if (!isValidPassword) {
        return next(
            new HttpError('No users found, credentials seems to be wrong.', 401)
        );
    }

    let token;
    try {
        token = jwt.sign(
            { userId: identifiedUser.id, email: identifiedUser.email },
            process.env.JWT_KEY,
            { expiresIn: '10 days' }
        );
    } catch (err) {
        console.log(err);

        const error = new HttpError(
            'Loggin In failed, please try again later.',
            500
        );
        return next(error);
    }

    res.json({ userId: identifiedUser.id, email: identifiedUser.email, token: token });
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;