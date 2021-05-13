const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');

const DUMMY_BLOCKS = [
    {
        id: 'c1',
        name: 'nav',
        code: 'html css',
        tag: 'css',
        creator: 'u1'
    }
]

const getCodeBlockById = (req, res, next) => {
    const blockId = req.params.cid;
    const codeBlock = DUMMY_BLOCKS.find(c => {
        return c.id === blockId;
    })

    if (!codeBlock) {
        return next(new HttpError("CodeBlock with that Id doesn't exist.", 404));
    }

    res.json({ codeBlock });
}

const getCodeBlockByUserId = (req, res, next) => {
    const userId = req.params.uid;

    const codeBlock = DUMMY_BLOCKS.find(c => {
        return c.creator === userId;
    })

    if (!codeBlock) {
        return next(new HttpError("CodeBlock with the creator doesn't exist"));
    }

    res.json({ codeBlock });
}

const createCodeBlock = (req, res, next) => {
    const { name, code, tags, creator } = req.body;
    const createdCodeBlock = {
        id: uuidv4(),
        name,
        code,
        tags,
        creator
    };

    DUMMY_BLOCKS.push(createdCodeBlock);
    console.log(DUMMY_BLOCKS)

    res.status(201).json({ codeBlock: createdCodeBlock });
}

exports.getCodeBlockById = getCodeBlockById;
exports.getCodeBlockByUserId = getCodeBlockByUserId;
exports.createCodeBlock = createCodeBlock;