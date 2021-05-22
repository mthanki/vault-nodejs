const express = require('express');
const { check } = require('express-validator');

const userController = require('../controllers/user-controller');

const router = express.Router();

// router.get('/', userController.getUsers);

router.post('/signup',
    [
        check('name').notEmpty(),
        check('email').isLength({ min: 1 }),
        check('password').isLength({ min: 8 })
    ],
    userController.signup);

router.post('/login', userController.login);

module.exports = router;