const { Router } = require('express')
const controller = require('../controller/adminController')

const adminRouter = Router()

adminRouter.get('/admin/best-profession', controller.findBestProfession)
adminRouter.get('/admin/best-clients', controller.findBestClients)

module.exports = adminRouter
