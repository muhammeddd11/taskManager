const authController = require('./../controllers/authController');
const express = require('express');
const router = express.Router();

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/updateMyPassword').post(authController.protect, authController.updatePassword);

module.exports = router