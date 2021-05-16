const express = require('express');
const { check } = require('express-validator');


const codeBlocksController = require('../controllers/codeBlocks-controller');

const router = express.Router();

router.get('/:cid', codeBlocksController.getCodeBlockById);

router.get('/user/:uid', codeBlocksController.getCodeBlocksByUserId);

router.post('/',
    [
        check('name').notEmpty(),
        check('code').isLength({ min: 1 }),
        check('tags').isLength({ min: 1 })
    ],
    codeBlocksController.createCodeBlock);

router.patch('/:cid', codeBlocksController.updateCodeBlock);

router.delete('/:cid', codeBlocksController.deleteCodeBlock);

module.exports = router;