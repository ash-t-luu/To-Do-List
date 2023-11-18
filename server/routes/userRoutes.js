const express = require('express');
const Router = express.Router();
const userController = require('../controllers/userController');
const authenticationController = require('../controllers/authenticationController');

Router
    .route('/signup')
    .post(userController.createUser, (req, res) => {
        return res.status(201).json({ message: 'Signup Successful' });
    });

Router.post('/login', userController.verifyUser, authenticationController.createCookie, (req, res) => {
    return res.status(201).json({ message: 'Login Successful' });
});

Router.get('/verify', authenticationController.verifyCookie, (req, res) => {
    return res.status(200).json({ message: 'Token Verified' });
});

Router.post('/logout', authenticationController.verifyCookie, authenticationController.clearCookie, (req, res) => {
    return res.status(200).redirect('/login');
});

Router.get('/api/sessions/oauth/google', authenticationController.googleOauthHandler, authenticationController.createCookie, (req, res) => {
    res.status(200).redirect('/');
});


module.exports = Router;