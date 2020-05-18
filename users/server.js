const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const port = process.argv.slice(2)[0];
const app = express();
app.use(bodyParser.json());

const users = [
    { id: 1,name: "John",age: 23,email:"john.doe@google.com", busy: false },
    { id: 2,name: "Raj",age: 24,email:"Raj@google.com", busy: false },
    { id: 3,name: "Rahul",age: 25,email:"Rahul@google.com", busy: false },
    { id: 4,name: "Jo",age: 26,email:"jo.doe@google.com", busy: false },
    { id: 5,name: "Joy",age: 27,email:"joy@google.com",busy: false },
      
];

app.get('/users', (req, res) => {
  console.log('Returning users list');
  res.send(users);
});



app.post('/user/**', (req, res) => {
  const userId = parseInt(req.params[0]);
  console.log(userId);
  const foundUser = users.find(subject => subject.id === userId);

  if (foundUser) {
      for (let attribute in foundUser) {
          if (req.body[attribute]) {
            foundUser[attribute] = req.body[attribute];
              console.log(`Set ${attribute} to ${req.body[attribute]} in user: ${userId}`);
          }
      }
      res.status(202).header({Location: `http://localhost:${port}/user/${foundUser.id}`}).send(foundUser);
  } else {
      console.log(`user not found.`);
      res.status(404).send();
  }
});

//console.log(`users service listening on port ${port}`);
//app.listen(port);

app.listen(8081,()=>{
    console.log('listening on 8081')
})