const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const DATABASE_URL = 'postgres://dxnmuevmlozhug:a364781679c64da401652538cefdcc567a12c5a7da820c170a52e00d90bba1a9@ec2-23-21-109-177.compute-1.amazonaws.com:5432/dcb5fr2bqduukd'
const pgClient = new Client({ 
  connectionString: DATABASE_URL,
  ssl: true
});
pgClient.connect();

// connect express with middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Wynger API');
});

app.get('/accounts', async (req, res) => {
  try {
    // fetch all accounts
    const accountData = await pgClient.query('SELECT * FROM salesforce.account');
    res.json({
      result: 'success',
      data: accountData.rows,
      error: null
    });
  } catch (error) {
    console.log('/accounts: Error fetching accounts :: ', error);
    pgClient.end();
    res.json({
      result: 'error',
      data: null,
      error: 'Failed to fetch accounts'
    });
  }
});

app.get('/products', async (req, res) => {
  try {
    // fetch all products
    const products = await pgClient.query('SELECT * FROM salesforce.account');
    res.json({
      type: 'success',
      data: products,
      error: null
    });
  } catch (error) {
    console.log('/products: Error fetching products :: ', error);
    pgClient.end();
    res.json({
      result: 'error',
      data: null,
      error: 'Failed to fetch products'
    });
  }
});

app.get('/contacts', async (req, res) => {
  try {
    // fetch all contacts
    const contacts = await pgClient.query('SELECT * FROM salesforce.contacts');
    res.json({
      type: 'success',
      data: contacts,
      error: null
    });
  } catch (error) {
    console.log('/contacts: Error fetching contacts :: ', error);
    pgClient.end();
    res.json({
      result: 'error',
      data: null,
      error: 'Failed to fetch contacts'
    });
  }
});

app.get('/cases', async (req, res) => {
  try {
    // fetch all cases
    const cases = await pgClient.query('SELECT * FROM salesforce.cases');
    res.json({
      type: 'success',
      data: cases,
      error: null
    });
  } catch (error) {
    console.log('/cases: Error fetching cases :: ', error);
    pgClient.end();
    res.json({
      result: 'error',
      data: null,
      error: 'Failed to fetch cases'
    });
  }
});

app.listen(port, async () => {
  try {
    console.error('Connecting to database...');
    await pgClient.connect();
    console.error('Connection sucessful');
  } catch (error) {
    console.error('Connection failed');
  }
  console.log(`Wynger API running on http://localhost:${port}`);
});
