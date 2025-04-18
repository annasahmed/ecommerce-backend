const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const httpStatus = require('http-status');
const { postgres } = require('./config/postgres');
const config = require('./config/config');
const morgan = require('./config/morgan');
const jwt = require('./config/jwt');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const responseFormatter = require('./middlewares/responseFormatter');
const executeCronJobs = require('./utils/cron');
const setUserMiddleware = require('./middlewares/setUserMiddleware');

const app = express();

if (config.env !== 'test') {
	app.use(morgan.successHandler);
	app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use((req, res, next) => {
	if (req.originalUrl.includes('stripe')) {
		next();
	} else {
		express.json()(req, res, next);
	}
});

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

app.use(cookieParser());

// connect to postgres database
app.use((req, _, next) => {
	req.postgres = postgres;
	next();
});

// jwt authentication
app.use(jwt());

app.use(setUserMiddleware); // Fetches user from DB & sets full `req.user`

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
	app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
	next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(responseFormatter);
// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// execute cron jobs
executeCronJobs();

module.exports = app;
