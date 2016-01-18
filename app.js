var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();
var MBE_ENV_DATA = [
    {
        envName: "(Dev) GTD",
        tokenURL:"https://mobile-dev.audaexplore.com/oauth/token",
        apiURL:"https://mobile-dev.audaexplore.com/api",
        accessToken:"hJDl3JZb5xCkcZCpfADqqKRTNo2EgwMD",
        orgID :"297",
        value:0
    },
    {
        envName: "(INT1) GTD",
        tokenURL:"https://mobile-int1.audaexplore.com/oauth/token",
        apiURL:"https://mobile-int1.audaexplore.com/api",
        accessToken:"nmdns7eFt3F2gY2DVUpFxi3pDv7j9lju",
        orgID :"477",
        value:1
    },
    {
        envName: "(CAE) GTD",
        tokenURL:"https://mobile-cae.audaexplore.com/oauth/token",
        apiURL:"https://mobile-cae.audaexplore.com/api",
        accessToken:"QLwxIFu1IjPqD3GjFOkRytvBUwghIMBB",
        orgID :"477",
        value:2
    },
    {
        envName: "(PROD) GTD",
        tokenURL:"https://mobile.audaexplore.com/oauth/token",
        apiURL:"https://mobile.audaexplore.com/api",
        accessToken:"Z6IwGI8JrtNwHvTD731wt4By4ffgds4F",
        orgID :"477",
        value:3
    }
];

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();

router.use(function(req, res, next) {
  next(); // make sure we go to the next routes and don't stop here
});

router.route('/login').post(function(req, res) {
      var data = {error: 'Please input correct username and password!'};
      var users = [{'username':'support','password':'Audatex8020!','role':'user'},{'username':'admin','password':'Audatex8020!','role':'admin'}];
      for(var i = 0; i < users.length; i++) {
        if(users[i].username == req.body.username && users[i].password == req.body.password) {
            data = users[i];
            data.environments  = MBE_ENV_DATA;
        }
      }
      res.json(data);
    });

app.use('/api', router);

var server = http.createServer(app);
 var port = 3010;
 server.listen(port, function() {
 console.log('Express server running on *:' + port);
 });

//module.exports = app;
