const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const { Client } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pgClient = new Client({ 
  connectionString: 'postgres://dxnmuevmlozhug:a364781679c64da401652538cefdcc567a12c5a7da820c170a52e00d90bba1a9@ec2-23-21-109-177.compute-1.amazonaws.com:5432/dcb5fr2bqduukd',
  ssl: true
});

// connect express with middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// attach routes
app.get('/', (req, res) => { res.send('Wynger API') });

app.get('/accounts', (req, res) => {
  pgClient
    .query('SELECT * FROM salesforce.account')
    .then(accountsData => {
      res.json({
        result: 'success',
        data: accountsData.rows,
        error: null
      });
    })
    .catch(e => {
      console.log('GET accounts/ Error: ', e);
      res.json({
        result: 'error',
        data: null,
        error: 'Failed to fetch accounts'
      });
    });
});

app.use('/cases', (req, res) => {
  pgClient
    .query('SELECT * FROM salesforce.case')
    .then(casesData => {
      res.json({
        result: 'success',
        data: casesData.rows,
        error: null
      });
    })
    .catch(e => {
      console.log('GET cases/ Error: ', e);
      res.json({
        result: 'error',
        data: null,
        error: 'Failed to fetch cases'
      });
    });
});

app.use('/contacts', (req, res) => {
  pgClient
    .query('SELECT * FROM salesforce.contact')
    .then(contactsData => {
      res.json({
        result: 'success',
        data: contactsData.rows,
        error: null
      });
    })
    .catch(e => {
      console.log('GET contacts/ Error: ', e);
      res.json({
        result: 'error',
        data: null,
        error: 'Failed to fetch contacts'
      });
    });
});

app.get('/products', (req, res) => {
  pgClient
    .query('SELECT * FROM salesforce.product2')
    .then(productsData => {
      res.json({
        result: 'success',
        data: productsData.rows,
        error: null
      });
    })
    .catch(e => {
      console.log('GET products/ Error: ', e);
      res.json({
        result: 'error',
        data: null,
        error: 'Failed to fetch products'
      });
    });
});

app.listen(port, () => {
  pgClient.connect();
  console.log(`Wynger API running on http://localhost:${port}`);
});
