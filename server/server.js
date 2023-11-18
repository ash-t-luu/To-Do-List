require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const PORT = process.env.PORT;
const cookieParser = require('cookie-parser');
const crudRoutes = require('./routes/crudRoutes');
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
    return res.sendFile(path.join((__dirname), 'index.html'));
});


app.use('/crud', crudRoutes);
app.use('/user', userRoutes);

app.use((req, res) => res.sendStatus(404));

app.use((err, req, res, next) => {
    const defaultErr = {
        log: 'Express error handler caught unknown middleware error',
        status: 500,
        message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});

module.exports = app;