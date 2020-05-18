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
        url: `${usersService}/user/${req.params.id}`,
    };

    let orders = {
        url: `${orderService}/orders/${req.params.id}`
    };
    // an example using an object instead of an array

    function callback(error, response, body, cb) {
        if(error || response.statusCode != 200)
          return cb(true);
    
        cb(null, JSON.parse(body));
      }

      let tasks = { // tasks to run in parallel
        orders: function (cb) {
          request(orders, function (error, response, body) {
              console.log(orders)
            callback(error, response, body, cb);
          });
        },
        users: function (cb) {
          request(users, function (error, response, body) {
              console.log(users);
            callback(error, response, body, cb);
          });
        }
      };

      async.parallel(tasks, function(err, results) {
        // results is now equals to: {one: 1, two: 2}
        resp.writeHead(200, {"Content-Type": "application/json"});
        console.log(results);
        resp.end(JSON.stringify(results));
      });
        
    });
    
// app.get('/orderdetails/',function(req, resp) {
//   // an example using an object instead of an array
//   async.parallel({
//     one: function(callback) {
//       console.log("One");
//       request('http://localhost:8081/users/1', function (error, response, body) {
//           if (!error && response.statusCode == 200) {
//               callback(null, body);
//           } else {
//             callback(true, {});
//           }
//       });
//     },
//     two: function(callback) {
//       console.log("Two");
//       request('http://localhost:8082/orders/1', function (error, response, body) {
//           if (!error && response.statusCode == 200) {
//               callback(null, body);
//           } else {
//             callback(true, {});
//           }
//       });
//     },
    
//   }, function(err, results) {
//     // results is now equals to: {one: 1, two: 2}
//   //  resp.writeHead(200, {"Content-Type": "application/json"});
//     console.log(results);
//     resp.send(results);
//    // resp.end(JSON.stringify(results));
//   });
// });
console.log(`details service listening on port ${port}`);
app.listen(port);