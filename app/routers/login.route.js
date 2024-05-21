const router = require('express').Router();
const LoginController = require('../controllers/login.controller');
const loginCtroller = new LoginController();

module.exports = (app) => {
  router.get('/', loginCtroller.getLogin);
  router.post('/', loginCtroller.postLogin);
  // router.get('/logout', loginCtroller.logout); 

  app.use('/login', router);
};
