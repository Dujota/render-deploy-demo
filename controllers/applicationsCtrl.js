const User = require('../models/user');

const index = async (req, res) => {
  try {
    res.render('applications/index.ejs');
  } catch (err) {
    res.redirect('/');
  }
};

module.exports = { index };
