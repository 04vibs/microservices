const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const async = require('async');

const port = process.argv.slice(2)[0];
const app = express();

app.use(bodyParser.json());

const usersService = 'http://localhost:8081';
const orderService = 'http://localhost:8082';


  app.get('/orderdetails/:id',(req, resp) =>  {
    
    let users = {
        url: `${usersService}/users/${req.params.id}`,
    };

    let orders = {
        url: `${orderService}/orders/${req.params.id}`
    };

    function callback(error, response, body, cb) {
        if(error || response.statusCode != 200)
          return cb(true);
        cb(null, JSON.parse(body));
      }

      let tasks = { // tasks to run in parallel
        orders: function (cb) {
          request(orders, function (error, response, body) {
            callback(error, response, body, cb);
          });
        },
        users: function (cb) {
          request(users, function (error, response, body) {
            callback(error, response, body, cb);
          });
        }
      };

      async.parallel(tasks, function(err, results) {
        resp.writeHead(200, {"Content-Type": "application/json"});
        resp.end(JSON.stringify(results));
      });        
    });
    
// console.log(`details service listening on port ${port}`);
app.listen(8085,()=>{
  console.log('listening on port 8085')
});