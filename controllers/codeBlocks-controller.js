const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const CodeBlock = require('../models/codeBlock');

let DUMMY_BLOCKS = [
    {
        id: 'c1',
        name: 'nav',
        code: 'html css',
        tag: 'css',
        creator: 'u1'
    }
]

const getCodeBlockById = async (req, res, next) => {
    const blockId = req.params.cid;

    let codeBlock;
    try {
        codeBlock = await CodeBlock.findById(blockId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find codeBlock.',
            500
        );
        return next(err);
    }

    if (!codeBlock) {
        const error = new HttpError("CodeBlock with that Id doesn't exist.", 404);
        return next(error);
    }

    res.json({ codeBlock: codeBlock.toObject({ getters: true }) });
}

const getCodeBlocksByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let codeBlocks;
    try {
        codeBlocks = await CodeBlock.find({ creator: userId });
    } catch (err) {
        const error = new HttpError("Fetching request failed.", 500);
        return next(error);
    }

    if (!codeBlocks || codeBlocks.length === 0) {
        const error = new HttpError("No CodeBlocks found for provided Id.", 500);
        return next(error);
    }

    res.json({ codeBlocks: codeBlocks.map(cb => cb.toObject({ getters: true })) });
}

const updateCodeBlock = async (req, res, next) => {
    const { name, code, tags } = req.body;
    const blockId = req.params.cid;

    let updatedBlock;
    try {
        updatedBlock = await CodeBlock.findById(blockId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update CodeBlock.', 500);
        return next(error);
    }

    updatedBlock.name = name;
    updatedBlock.code = code;
    updatedBlock.tags = tags;

    try {
        await updatedBlock.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update CodeBlock.', 500);
        return next(error);
    }

    res.status(200).json({ codeBlock: updatedBlock.toObject({ getters: true }) });
}

const createCodeBlock = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError(
            'Created place failed, please include all fields.',
            500
        );
        return next(error);
    }

    const { name, code, tags, creator } = req.body;
    const createdCodeBlock = new CodeBlock({
        name,
        code,
        tags,
        creator,
    })

    try {
        createdCodeBlock.save();
    } catch {
        const error = new HttpError(
            'Created place failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ codeBlock: createdCodeBlock });
}

const deleteCodeBlock = async (req, res, next) => {
    const blockId = req.params.cid;

    let codeBlock;
    try {
        codeBlock = await CodeBlock.findById(blockId);
    } catch (err) {
        const error = new HttpError(
            'Could not delete CodeBlock, please try again.',
            500
        );
        return next(error);
    }

    try {
        await codeBlock.remove();
    } catch (err) {
        const error = new HttpError(
            'Could not delete CodeBlock, please try again.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'CodeBlock deleted.' });
}

exports.getCodeBlockById = getCodeBlockById;
exports.getCodeBlocksByUserId = getCodeBlocksByUserId;
exports.createCodeBlock = createCodeBlock;
exports.updateCodeBlock = updateCodeBlock;
exports.deleteCodeBlock = deleteCodeBlock;