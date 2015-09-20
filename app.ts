///<reference path="typings/node/node.d.ts"/>
///<reference path="typings/express/express.d.ts"/>
///<reference path="typings/body-parser/body-parser.d.ts"/>
///<reference path="typings/method-override/method-override.d.ts"/>
///<reference path="typings/morgan/morgan.d.ts"/>
///<reference path="typings/custom/ServerProtoRequest.d.ts"/>


//import ServerProtoRequest  from './typings/custom/ServerProtoRequest';
import ApiAbstract from './api/ApiAbstract';
import apis from './api/api';

import express        = require('express')
import bodyParser     = require('body-parser')
import methodOverride = require('method-override')
import morgan = require('morgan')
import http = require('http')
import path = require('path')

var errorHandler   = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(errorHandler())
}

app.use('/:apiVersion/', function (req: ServerProtoRequest, res: express.Response, next: Function) {

    var apiVersion = req.params['apiVersion'];
    var api: ApiAbstract = apis[apiVersion];

    if (!api) {

        res.status(404).send('the api version ' + apiVersion + ' doesn\'t exist');
    } else {

        req.api = api;
        next();
    }
});

app.use((req: ServerProtoRequest, res: express.Response, next: Function) => req.api.checkAuthenticationMiddleWare(req, res, next));

app.get('/*/user', (req: ServerProtoRequest, res: express.Response) => req.api.getUser(req, res));
app.post('/*/user', (req: ServerProtoRequest, res: express.Response) => req.api.setUser(req, res));
app.delete('/*/user', (req: ServerProtoRequest, res: express.Response) => req.api.removeUser(req, res));


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'))
});



