const express = require('express');

const HttpError = require('./models/http-error');

const codeBlockRoutes = require("./routes/codeBlock-routes");

const app = express();

app.use(express.json());

app.use('/api/code-blocks', codeBlockRoutes);

app.use((req, res, next) => {
    const error = new HttpError("Route invalid, doesn't exist.", 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({ message: error.message || "Unknown error discovered." });
});

app.listen(8000);