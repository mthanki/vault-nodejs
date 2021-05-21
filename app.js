const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

const HttpError = require('./models/http-error');

const codeBlockRoutes = require("./routes/codeBlock-routes");
const userRoutes = require("./routes/user-routes");

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ycivl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
).then(() => {
    console.log('Connected to Database!');
}).catch(() => {
    console.log('Connection failed!');
});

const app = express();

app.options('*', cors());

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
})

app.use('/api/code-blocks', codeBlockRoutes);
app.use('/api/users', userRoutes);

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