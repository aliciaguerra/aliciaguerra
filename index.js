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

app.set('port', (process.env.PORT || 5000));

app.use(logger('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

var router=express.Router();

router.use(function(req,res,next){
	next();
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

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


