const path = require('path');
const express = require('express');

const expenseController = require('../controllers/expenseNew');
const userauthentication = require('../middleware/auth');

const router = express.Router();

router.post('/addexpense', userauthentication.authenticate, expenseController.addexpense);

router.get('/getexpense/:page/:rows', userauthentication.authenticate , expenseController.getexpense);

router.delete('/deleteexpense/:id', userauthentication.authenticate, expenseController.deleteexpense);

module.exports = router;