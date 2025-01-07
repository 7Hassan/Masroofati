const express = require('express')
const Router = express.Router()
const func = require('../controller/api')



Router.use(func.protectAPI)
Router.route('/add').post(func.add)
Router.route('/data').get(func.data)
Router.route('/analyticsData').get(func.analyticsData)
Router.route('/logout').get(func.logOut)
Router.route('/user').get(func.user)
module.exports = Router
