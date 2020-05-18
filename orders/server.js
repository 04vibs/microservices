const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');

const port = process.argv.slice(2)[0];
const app = express();

app.use(bodyParser.json());

const usersService = 'http://localhost:8081';

const orders = [
    {
        id: 1,
        orderAmount: 550,
        orderDate: '12-Apr-2020',
        assignedUser: 1
      },
     {
        id: 2,
        orderAmount: 450,
        orderDate: '15-Apr-2020',
        assignedUser: 0
      },
      {
        id: 3,
        orderAmount: 250,
        orderDate: '13-Apr-2020',
        assignedUser: 0
      },
     {
        id: 4,
        orderAmount: 500,
        orderDate: '15-Apr-2020',
        assignedUser: 0
      }  
];

app.get('/orders', (req, res) => {
  console.log('Returning threats list');
  res.send(orders);
});

app.get('/orders/:id', (req, res) => {
  console.log('Returning order list');

  const assignedUserId = req.params.id;
  console.log(assignedUserId);
  let result = [];
  order = orders.find(subject => {
    if(subject.assignedUser === parseInt(assignedUserId)){
      result.push(subject);
    }
  });
  console.log(result)
  res.send(result);



});


app.post('/assignment', (req, res) => {
  request.post({
      headers: {'content-type': 'application/json'},
      url: `${usersService}/user/${req.body.userId}`,
      body: `{
          "busy": true
      }`
  }, (err, userResponse, body) => {
      if (!err) {
          const orderId = parseInt(req.body.orderId);
          console.log(orderId);
          const order = orders.find(subject => subject.id === orderId);
          order.assignedUser = req.body.userId;
          console.log(order);
          res.status(202).send(order);
      } else {
          res.status(400).send({problem: `user Service responded with issue ${err}`});
      }
  });
});


// console.log(`orders service listening on port ${port}`);
// app.listen(port);

app.listen(8082,()=>{
  console.log('order service started at 8082');
})