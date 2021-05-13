const express = require('express');

const codeBlocksController = require('../controllers/codeBlocks-controller');

const router = express.Router();

router.get('/:cid', codeBlocksController.getCodeBlockById);

router.get('/user/:uid', codeBlocksController.getCodeBlockByUserId);

router.post('/', codeBlocksController.createCodeBlock);

module.exports = router;