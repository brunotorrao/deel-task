const {Router} = require('express')
const controller = require('../controller/jobController')

const jobRouter = Router()

jobRouter.get('/jobs/unpaid', controller.findAllUnpaid)
jobRouter.post(`/jobs/:jobId/pay`, controller.pay)


module.exports = jobRouter
