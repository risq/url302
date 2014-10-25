var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    async = require('async'),
    util = require('util');



var app = express();

var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());


app.post('/', function(request, response) {
    if (request.body) {
        // console.log(util.inspect(request.body, {
        //     showHidden: true,
        //     depth: null
        // }));
        async.map(request.body, updateObject, function(err, results) {
            response.send(results);
        });
    }
});

app.listen(port, function() {
    // console.log('App running on http://localhost:' + port);
});

function updateObject(object, callback) {
    if (object.cover) {
        getUrl(object.cover, function(trueUrl) {
            object.cover = trueUrl;
            callback(false, object);
        });
    }
}

function getUrl(url, done) {
    http.get(url, function(res) {
        if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {
            done(res.headers.location);
        } else {
            done(null);
        }
        res.destroy();
    });
}
