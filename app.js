const express  = require('express');
const morgan   = require('morgan');
const mongoose = require('mongoose');
const port     = process.env.PORT || 8000;
const router   = require('./config/routes');
const bodyParser = require('body-parser');

const app = express();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/pumpkr');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));
app.use('/', router);
app.listen(port, () => { console.log("pumpkings!"); });
