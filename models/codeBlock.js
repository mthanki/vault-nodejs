const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CodeBlockSchema = new Schema({
    name: { type: String, require: true },
    code: { type: String, require: true },
    tags: { type: [String], require: true },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = mongoose.model('CodeBlock', CodeBlockSchema);