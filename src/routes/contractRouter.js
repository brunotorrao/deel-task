const { Router } = require('express');
const controller = require('../controller/contractController');

const contractRouter = Router();

contractRouter.get('/contracts/:id', controller.findById);
contractRouter.get('/contracts', controller.findAll)

module.exports = contractRouter;
