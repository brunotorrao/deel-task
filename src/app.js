const express = require('express');
const bodyParser = require('body-parser');
const {getProfile} = require('./middleware/getProfile')
const contractRouter = require("./routes/contractRouter");
const jobRouter = require('./routes/jobRouter')
const balanceRouter = require('./routes/balanceRouter')
const adminRouter = require('./routes/adminRouter')
const appHandler = require('./middleware/appHandler')

const app = express();

app.use(bodyParser.json());
app.use(getProfile)
app.use(contractRouter)
app.use(jobRouter)
app.use(balanceRouter)
app.use(adminRouter)

app.use(appHandler.notFound);
app.use(appHandler.handleError);

module.exports = app;
