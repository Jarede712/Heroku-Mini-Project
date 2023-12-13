const express = require('express');
const path = require('path');
const fs = require('fs');
const { clog } = require('./middleware/clog');
const api = require('./routes/index.js');

const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "cLog"
app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

// Serve static files
app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for feedback page
app.get('/feedback', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/pages/feedback.html'))
);

// POST route for /api/diagnostics
app.post('/api/diagnostics', (req, res) => {
  const data = req.body;
  // Save data to db/diagnostics.json
  fs.writeFileSync('db/diagnostics.json', JSON.stringify(data), 'utf8');
  res.status(200).send('Data saved successfully');
});

// GET route for /api/diagnostics
app.get('/api/diagnostics', (req, res) => {
  // Read data from db/diagnostics.json
  const data = fs.readFileSync('db/diagnostics.json', 'utf8');
  res.status(200).send(data);
});

// Route for handling 404 requests(unavailable routes)
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/404.html'))
);

// Start the server
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
