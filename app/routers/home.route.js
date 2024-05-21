
const router = require("express").Router();
const HomeController = require('../controllers/user/home.controller');
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

module.exports = (app) => {
    router.get('/', HomeController.index);

    app.use('/home', ensureAuthenticated, router);
};