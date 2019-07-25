const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const jsforce = require('jsforce');


const app = express();
const port = process.env.PORT || 3000;
// const jsforceConn = new jsforce.Connection({
//   loginUrl: 'https://test.salesforce.com'
// });


// connect express with middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', function home(req, res) {
  res.send('Wynger API');
});

app.post('/login', function loginUser(req, res) {
  console.log('req.body: ', req.body);
  res.json(req.body);
});

app.post('/authenticate', function authentciateUser(req, res) {
  res.send('POST to localhost://3000/authentciate');
});

app.get('/accounts', function fetchAccounts(req, res) {
  res.send('GET to localhost://3000/accounts');
});

app.get('/contacts', function fetchContacts(req, res) {
  res.send('GET to localhost://3000/contacts');
});

app.get('/cases', function fetchCases(req, res) {
  res.send('GET to localhost://3000/cases');
});

app.get('/products', function fetchProducts(req, res) {
  res.send('GET to localhost://3000/products');
});

app.get('/opportunities', function fetchOpportunities(req, res) {
  res.send('GET to localhost://3000/opportunities');
});

app.listen(port, function startServer() {
  console.log(`Wynger API running on localhost://${port}`);
});

console.log('Executing Salesforce Code...');
jsforceConn.login('charllie.roth@wynger.com', 'YouReallyCool1!', function(error, res) {
  if (error) {
    console.log('ERROR -- jsforceConn.login() callback');
    console.error(error);
    return;
  }

  console.log("User Information: ", res);
  console.log("Eventually do something with it....");
  
  jsForceConn.query('SELECT Id, Name FROM Account', function(error, response) {
   if (error) { 
     console.error(error);
     return  
   }
   console.log(response);
  });
});

