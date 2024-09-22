require('dotenv').config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorMiddleware = require('./middleware/error-middleware');

const router = require('./router');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        app.listen(5000, () =>
            console.log(`Сервер запущен и слушает порт ${PORT}`)
        );
    } catch (e) {
        console.log(e);
    }
};

start();
