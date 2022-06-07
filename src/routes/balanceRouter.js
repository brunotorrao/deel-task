const { Router } = require('express');
const controller = require('../controller/balanceController');

const balanceRouter = Router();

balanceRouter.post('/balances/deposit/:userId', controller.deposit);

module.exports = balanceRouter;
