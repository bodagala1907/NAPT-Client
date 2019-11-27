const bodyParser =  require('body-parser');
const express =  require('express');
const path = require('path');
const ejs = require('ejs');
var cors = require('cors');
 

const apiRouter = require('./server/routes/apiRoute');
const jenkinsRouter = require('./server/routes/jenkinsRoute');


const app = express();
app.use(cors())

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const DIST_FOLDER = path.join(process.cwd(), 'build');

// view engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.set('views',DIST_FOLDER);
app.get('*.*', express.static(DIST_FOLDER));

app.use('/api', apiRouter);
app.use('/api/jenkins', jenkinsRouter);


app.get('*', function(req,res){
  console.log('****');
  res.render('index', {});
});

app.listen(process.env.PORT || 3000, () => {
  console.log('info', 'Server started on port: ' + (process.env.PORT || 3000));
});

module.exports = app;