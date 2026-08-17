const User = require('../models/user');

const index = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.render('applications/index.ejs', { applications: user.applications });
  } catch (err) {
    res.redirect('/');
  }
};

const show = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const application = user.applications.id(req.params.appId);

    res.render('applications/show.ejs', { application });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const deleteApp = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.applications.pull(req.params.appId);

    await user.save();

    res.redirect(`/users/${user._id}/applications`);
  } catch (err) {
    console.log(err);
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

const edit = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const application = user.applications.id(req.params.appId);

    res.render('applications/edit.ejs', { application });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const update = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const application = user.applications.id(req.params.appId);

    application.set(req.body);

    await user.save();

    res.redirect(`/users/${user._id}/applications/${application._id}`);
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

module.exports = {
  index,
  new: newApp,
  create,
  show,
  delete: deleteApp,
  edit,
  update,
};
