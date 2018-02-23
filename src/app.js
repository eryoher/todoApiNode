const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 8083);


//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())

//routes
require('./routes/lists')(app);

app.listen(app.get('port'), () => {
  console.log('runing.... 8083');
});
