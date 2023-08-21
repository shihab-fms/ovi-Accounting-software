const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');

const globalErrorHandler = require('./controller/errorController');
const AppError = require('./utils/appError');
const usersRoute = require('./route/usersRoute');
const branchRoute = require('./route/branchRoute');
const ledgerRoute = require('./route/ledgerRoute');
const typesofPaymentRoute = require('./route/typesOfPaymentRoute');
const paymentRoute = require('./route/paymentRoute');
const itemRoute = require('./route/itemRoute');
const unitRoute = require('./route/unitRoute');
const purchaseRoute = require('./route/purchaseRoute');
const viewRoute = require('./route/viewRoute');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware Function
app.use(express.static(path.join(__dirname, 'public')));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser and Form data parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

//test Middleware

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// route Handler
app.use('/', viewRoute);
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/branchs', branchRoute);
app.use('/api/v1/ledgers', ledgerRoute);
app.use('/api/v1/paymentTypes', typesofPaymentRoute);
app.use('/api/v1/payments', paymentRoute);
app.use('/api/v1/items', itemRoute);
app.use('/api/v1/units', unitRoute);
app.use('/api/v1/purchases', purchaseRoute);

// Handling error
app.all('*', (req, _, next) =>
  next(
    new AppError(`we don't find data on ${req.originalUrl} this server`, 404)
  )
);

// const u = purchaseRoute.x()

// Global Error Handling
app.use(globalErrorHandler);

module.exports = app;
