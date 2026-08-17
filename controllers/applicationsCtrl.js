const User = require('../models/user');

const index = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.render('applications/index.ejs', { applications: user.applications });
  } catch (err) {
    res.redirect('/');
  }
};

const newApp = async (req, res) => {
  try {
    res.render('applications/new.ejs');
  } catch (err) {
    res.redirect('/');
  }
};

const create = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.applications.push(req.body);
    await user.save();

    res.redirect('/users/:id/applications');
  } catch (err) {
    console.log(err);
    res.redirect('/users/:id/applications/new');
  }
};

module.exports = { index, new: newApp, create };
