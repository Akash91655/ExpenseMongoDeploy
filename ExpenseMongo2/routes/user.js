const path = require('path');

const express = require('express');

const userController = require('../controllers/user');
const expenseController = require('../controllers/expenseNew');

const authenticationmiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/signup', userController.postUserSignup);

router.post('/login', userController.postUserLogin);

// router.post('/addexpense', authenticationmiddleware.authenticate, expenseController.);

// router.get('/download', authenticationmiddleware.authenticate, expenseController.);

// router.get('/getexpenses', authenticationmiddleware.authenticate, expenseController.);

router.get('/download', authenticationmiddleware.authenticate, expenseController.downloadexpense);

module.exports = router;