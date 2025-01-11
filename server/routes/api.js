const express = require('express');
const Router = express.Router();
const func = require('../controller/api');


Router.use(func.user);
Router.route('/guest').get(func.createGuestAccount, func.data);
Router.use(func.protectAPI);
Router.route('/add').post(func.add);
Router.route('/delete').post(func.delete, func.deleteErr);
Router.route('/data').get(func.data);
Router.route('/logout').get(func.logOut);
Router.route('/user').get(func.getUser);

module.exports = Router;
