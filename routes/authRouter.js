const express = require('express');
const authCtrl = require('../controllers/authCtrl');
const isSignedIn = require('../middleware/isSignedIn');

const router = express.Router({ mergeParams: true });

router.get('/sign-up', authCtrl.signup);
router.post('/sign-up', authCtrl.register);
router.get('/sign-in', authCtrl.signin);
router.post('/sign-in', authCtrl.login);

// Private
router.get('/sign-out', isSignedIn, authCtrl.signout);

module.exports = router;
