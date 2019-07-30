const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const { Client } = require('pg');
const jsforce = require('jsforce');

// instantiate express application
const server = express();
const port = process.env.PORT || 3000;

// create postgres connection
const pgClient = new Client({ 
  connectionString: 'postgres://dxnmuevmlozhug:a364781679c64da401652538cefdcc567a12c5a7da820c170a52e00d90bba1a9@ec2-23-21-109-177.compute-1.amazonaws.com:5432/dcb5fr2bqduukd',
  ssl: true
});

// create salesforce connection
const jsforceConn = new jsforce.Connection();

// connect express with middleware
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors());

// attach routes to express application
server.get('/', (req, res) => { res.send('Wynger API') });

// login page
server.post('/login', (req, res) => {
  const username = req.body.username;
  const passwordPlusToken = req.body.passwordPlusToken;

  jsforceConn.login(username, passwordPlusToken, (error, userInfo) => {
    // error logging user in
    if (error) {
      res.json({
        result: 'error',
        data: null,
        error: 'Failed to login'
      });
      return console.error(error);
    }

    pgClient
    .query(
      'SELECT * FROM salesforce.user WHERE sfid = $1', 
      [userInfo.id]
    )
    .then(userData => {
      // user successfully logged in
      res.json({
        result: 'success',
        data: {
          user: userData.rows[0],
          accessToken: jsforceConn.accessToken
        },
        error: null
      });
    })
    .catch(e => {
      res.json({
        result: 'error',
        data: null,
        error: 'Failed to fetch user from DB'
      });
    });
  });
});

server.post('/logout', (req, res) => {
  jsforceConn.logout((error) => {
    if (error) {
      res.json({
        result: 'error',
        data: null,
        error: 'Failed to log user out'
      });
      return console.error('Failed to log user out: ', error);
    }
    console.log('Logout successful');
    res.json({
      result: 'success',
      data: null,
      error: null
    });
  });
})


// Accounts Page
// 1. Metadata about Accounts Object (Listviews)
// 2. Accounts owned/accessible by user
server.get('/account_page', (req, res) => {
  jsforceConn.query("SELECT Id, Name FROM Account", (error, result) => {
    if (error) return console.error('Error fetching accounts: ', error);
    console.log('result.records: ', result.records);
    console.log('-------------------------------------');
  });
});

// Account Details Page
// 1. Metadata about Accounts Record Page (Fields, Related Lists) [Contacts, Cases, Opps]
// 2. Information about individual Account

// Products Page
// 1. Metadata about Products Object (Listviews)
// 2. Products owned/accessible by user

// Product Details Page
// 1. Metadata about Products Record Page (Fields, Related Lists) [Cases, Standard Price, Price Book??]
// 2. Information about individual Product

// Case Details Page
// 1. Metadata about Case Record Page (Fields, Related Lists) [Case History, Case Comments, Solutions, Notes & Attachments]
// 2. Information about individual Case

// Opportunity Details Page
// 1. Metadata about Opportunity Page (Fields, Related Lists) [Products, Notes & Attachments


server.get('/accounts', (req, res) => {
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
      console.log('GET /accounts Error: ', e);
      res.json({
        result: 'error',
        data: null,
        error: 'Failed to fetch accounts'
      });
    });
});

server.get('/cases', (req, res) => {
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
      console.log('GET /cases Error: ', e);
      res.json({
        result: 'error',
        data: null,
        error: 'Failed to fetch cases'
      });
    });
});

server.get('/contacts', (req, res) => {
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
      console.log('GET /contacts Error: ', e);
      res.json({
        result: 'error',
        data: null,
        error: 'Failed to fetch contacts'
      });
    });
});

server.get('/products', (req, res) => {
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
      console.log('GET /products Error: ', e);
      res.json({
        result: 'error',
        data: null,
        error: 'Failed to fetch products'
      });
    });
});

server.get('/listviews', (req, res) => {
  pgClient
    .query('SELECT * FROM salesforce.listview')
    .then(listViewData => {
      res.json({
        result: 'success',
        data: listViewData.rows,
        error: null
      });
    })
    .catch(e => {
      console.log('GET /listviews Error: ', e);
      res.json({
        result: 'error',
        data: null,
        error: 'Failed to fetch list views'
      });
    });
});

server.get('/opportunities', (req, res) => {
  pgClient
    .query('SELECT * FROM salesforce.opportunity')
    .then(opsData => {
      res.json({
        result: 'success',
        data: opsData.rows,
        error: null
      });
    })
    .catch(e => {
      console.log('GET /opportunities Error: ', e);
      res.json({
        result: 'error',
        data: null,
        error: 'Failed to fetch opportunities'
      });
    });
});

server.get('/pricebooks', (req, res) => {
  pgClient
    .query('SELECT * FROM salesforce.pricebook2')
    .then(priceBookData => {
      res.json({
        result: 'success',
        data: priceBookData.rows,
        error: null
      });
    })
    .catch(e => {
      console.log('GET /pricebooks Error: ', e);
      res.json({
        result: 'error',
        data: null,
        error: 'Failed to fetch pricebooks'
      });
    });
});

server.get('/solutions', (req, res) => {
  pgClient
    .query('SELECT * FROM salesforce.solution')
    .then(solutionsData => {
      res.json({
        result: 'success',
        data: solutionsData.rows,
        error: null
      });
    })
    .catch(e => {
      console.log('GET /solutions Error: ', e);
      res.json({
        result: 'error',
        data: null,
        error: 'Failed to fetch solutions'
      });
    });
});

server.get('/casehistory', (req, res) => {
  pgClient
    .query('SELECT * FROM salesforce.casehistory')
    .then(casehistoryData => {
      res.json({
        result: 'success',
        data: casehistoryData.rows,
        error: null
      });
    })
    .catch(e => {
      console.log('GET /casehistory Error: ', e);
      res.json({
        result: 'error',
        data: null,
        error: 'Failed to fetch case history records'
      });
    });
});

server.listen(port, () => {
  pgClient.connect();
  console.log(`Wynger API running on http://localhost:${port}`);
});
