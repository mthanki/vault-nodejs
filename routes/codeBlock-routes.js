const express = require('express');
const { check } = require('express-validator');

const checkAuth = require('../middleware/check-auth');

const codeBlocksController = require('../controllers/codeBlocks-controller');

const router = express.Router();

router.get('/:cid', codeBlocksController.getCodeBlockById);

// Routes after this require auth token
router.use(checkAuth);

router.get('/user/:uid', codeBlocksController.getCodeBlocksByUserId);

router.post('/',
    [
        check('name').notEmpty(),
        check('code').isLength({ min: 1 }),
        check('tags').isLength({ min: 1 })
    ],
    codeBlocksController.createCodeBlock);

router.patch('/:cid',
    [
        check('name').notEmpty(),
        check('code').isLength({ min: 1 }),
        check('tags').isLength({ min: 1 })
    ],
    codeBlocksController.updateCodeBlock);

router.delete('/:cid', codeBlocksController.deleteCodeBlock);

module.exports = router;