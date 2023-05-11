const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controller/errorController');
const AppError = require('./utils/appError');

const userRoute = require('./router/userRoute');
const typeOfRoute = require('./router/typeOfProductRoute');
const productRoute = require('./router/productRoute');
const purchaseRoute = require('./router/purchaseRoute');
const sellRoute = require('./router/sellRoute');
const viewRoute = require('./router/viewRoute');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'view'));
// app.set('views', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/', viewRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/typeof', typeOfRoute);
app.use('/api/v1/purchase', purchaseRoute);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/sell', sellRoute);

// Handling error
app.all('*', (req, _, next) =>
  next(
    new AppError(`we don't find data on ${req.originalUrl} this server`, 404)
  )
);

// Global Error Handling
app.use(globalErrorHandler);

module.exports = app;
