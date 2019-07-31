const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const { Client } = require('pg');
const jsforce = require('jsforce');

// utilities
const { asyncMetadataRead } = require('./utils');

// instantiate express application
const server = express();
const port = process.env.PORT || 3000;

// create postgres connection
const pgClient = new Client({ 
  connectionString: 'postgres://dxnmuevmlozhug:a364781679c64da401652538cefdcc567a12c5a7da820c170a52e00d90bba1a9@ec2-23-21-109-177.compute-1.amazonaws.com:5432/dcb5fr2bqduukd',
  ssl: true
});

// create salesforce connection
console.log('Creating salesforce connections...');
const jsforceConn = new jsforce.Connection();
const jsforceAdminConn = new jsforce.Connection();
jsforceAdminConn.login('charllie.roth@wynger.com', 'YouReallyCool1!QS58osVbH4Du7wQz9w2bvHQn', (error, userInfo) => {
  if (error) return console.error('Admin failed to connected');
  console.log('Admin successfully connected...');
})

// connect express with middleware
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors());

// Attach routes to express server
server.get('/', (req, res) => { res.send('Wynger API') });

// User Login
server.post('/login', (req, res) => {
  const username = req.body.username;
  const passwordPlusToken = req.body.passwordPlusToken;

  jsforceConn.login(username, passwordPlusToken, (error, userInfo) => {
    // error logging user in
    if (error) {
      console.error(error);
      res.status(400).json({
        result: 'error',
        data: null,
        error: 'Failed to login'
      });
    }

    pgClient
    .query(
      'SELECT * FROM salesforce.user WHERE sfid = $1', 
      [userInfo.id]
    )
    .then(userData => {
      // user successfully logged in
      res.status(200).json({
        result: 'success',
        data: {
          user: userData.rows[0],
          accessToken: jsforceConn.accessToken
        },
        error: null
      });
    })
    .catch(e => {
      res.status(404).json({
        result: 'error',
        data: null,
        error: 'Failed to fetch user from DB'
      });
    });
  });
});

// User Logout
server.post('/logout', (req, res) => {
  jsforceConn.logout((error) => {
    if (error) {
      res.status(400).json({
        result: 'error',
        data: null,
        error: 'Failed to log user out'
      });
      return console.error('Failed to log user out: ', error);
    }
    console.log('Logout successful');
    res.status(200).json({
      result: 'success',
      data: null,
      error: null
    });
  });
})

// Accounts Screen -- List Views, Fields
server.get('/accounts_screen', async (req, res) => {
  try {
    const metadata = await asyncMetadataRead(jsforceAdminConn, 'Account');
    //TODO: Make accounts user specific (access/permissions)
    const accountsData = await pgClient.query('SELECT * FROM salesforce.account');
    res.status(200).json({
      result: 'success',
      data: {
        metadata: {
          fields: metadata.fields,
          label: metadata.label,
          listViews: metadata.listViews
        },
        accounts: accountsData.rows,
      },
      error: null
    });
  } catch (error) {
    console.error('ERROR -- GET /accounts_screen: ', error);
    res.status(400).json({
      result: 'error',
      data: null,
      error: 'Failed to fetch account metadata'
    });
  }
});

// Account Details Screen -- Related Lists (Contacts, Cases, Opportunities)
server.get('/account_details_screen/:accountId', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    // get contacts for account
    const contactsData = await pgClient.query(
      'SELECT * FROM salesforce.contact WHERE accountid = $1',
      [accountId]
    );

    // get cases for account
    const casesData = await pgClient.query(
      'SELECT * FROM salesforce.case WHERE accountid = $1',
      [accountId]
    );

    // get opportunities for account
    const opsData = await pgClient.query(
      'SELECT * FROM salesforce.opportunity WHERE accountid = $1',
      [accountId]
    );

    res.status(200).json({
      status: 'success',
      data: {
        contacts: contactsData.rows,
        cases: casesData.rows,
        opportunities: opsData.rows,
      },
      error: null
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      result: 'error',
      data: null,
      error: 'Failed to fetch account details page data'
    });
  }
})

// Products Screen -- List Views, Fields
server.get('/products_screen', async (req, res) => {
  try {
    const metadata = await asyncMetadataRead(jsforceAdminConn, 'Product2');
    //TODO: Make products user specific (access/permissions)
    const productsData = await pgClient.query('SELECT * FROM salesforce.product2');
    res.status(200).json({
      result: 'success',
      data: {
        metadata: {
          fields: metadata.fields,
          label: metadata.label,
          listViews: metadata.listViews
        },
        products: productsData.rows,
      },
      error: null
    });
  } catch (error) {
    console.error('ERROR -- GET /products_screen: ', error);
    res.status(400).json({
      result: 'error',
      data: null,
      error: 'ERROR -- GET /products_screen'
    });
  }
});

// Product Details Screen -- Related Lists (Price Book Entries)
server.get('/product_details_screen/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const pricebookEntryData = await pgClient.query(
      'SELECT * FROM salesforce.pricebookentry WHERE product2id = $1',
      [productId]
    );
    res.status(200).json({
      result: 'success',
      data: pricebookEntryData.rows,
      error: null
    });
  } catch (error) {
    console.error('ERROR -- GET /product_details_screen: ', error);
    res.status(400).json({
      result: 'error',
      data: null,
      error: 'Failed to fetch pricebook entries for product'
    });
  }
});

// Case Details Page -- Related Lists (Case History, Solutions)
// TODO: Retrieve metadata (Fields)
server.get('/case_details_screen/:caseId', async (req, res) => {
  try {
    const caseId = req.params.caseId;
    // get case history for account
    const caseHistoryData = await pgClient.query(
      'SELECT * from salesforce.casehistory WHERE caseid = $1',
      [caseId]
    );

    // get solutions for account
    const solutionsData = await pgClient.query(
      'SELECT * from salesforce.solution WHERE caseid = $1',
      [caseId]
    );

    res.status(200).json({
      result: 'success',
      data: {
        caseHistory: caseHistoryData.rows,
        solutions: solutionsData.rows
      },
      error: null
    });
  } catch (error) {
    console.error('ERROR -- GET /case_details_screen: ', error);
    res.status(400).json({
      result: 'error',
      data: null,
      error: ''
    })
  }
});

// Opportunity Details Page -- Retrieve metadata (Fields)
server.get('/opportunity_details_page/:opId', async (req, res) => {
  try {} catch (error) {}
});

server.listen(port, () => {
  pgClient.connect();
  console.log(`Wynger API running on http://localhost:${port}`);
});
