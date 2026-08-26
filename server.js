/* eslint-disable prefer-destructuring */
require('dotenv').config();
require('./config/databse');

const express = require('express');

const app = express();

// This is for mongo db proxy
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.set('trust proxy', 1);
}

// Middleware
const session = require('express-session');
const MongoStore = require('connect-mongo').MongoStore;
const methodOverride = require('method-override');
const morgan = require('morgan');
const isSignedIn = require('./middleware/isSignedIn');
const addUserToViews = require('./middleware/addUserToViews');

// CONTROLLERS
const authRouter = require('./routes/authRouter');
const applicationsCtrl = require('./controllers/applicationsCtrl');

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : '3000';

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride('_method'));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
    },
  })
);

app.use(addUserToViews);

// PUBLIC ROUTES
app.get('/', async (req, res) => {
  if (req.session.user) {
    return res.redirect(`/users/${req.session.user._id}/applications`);
  }
  res.render('index.ejs');
});

app.use('/auth', authRouter);

// Customer middleware
app.use(isSignedIn);

// PRIVATE ROUTES

// Applications
app.get('/users/:id/applications', applicationsCtrl.index);
app.get('/users/:id/applications/new', applicationsCtrl.new);
app.post('/users/:id/applications', applicationsCtrl.create);
app.get('/users/:id/applications/:appId', applicationsCtrl.show);
app.delete('/users/:id/applications/:appId', applicationsCtrl.delete);
app.get('/users/:id/applications/:appId/edit', applicationsCtrl.edit);
app.put('/users/:id/applications/:appId', applicationsCtrl.update);

app.listen(port, '0.0.0.0', () => {
  console.log(`The express app is ready on port ${port}!`);
});
