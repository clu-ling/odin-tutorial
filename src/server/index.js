const axios = require('axios');

const express = require('express');

const cors = require('cors');

const path = require("path");

const app = express();

const config = require('../../config');

app.use(cors());
app.use(express.static('dist'));

app.get('/api/extract', (req, res) => {
  const data = {};
  data[config.odin.api.extract.params.rules] = req.query[config.odin.api.extract.params.rules];
  data[config.odin.api.extract.params.text] = req.query[config.odin.api.extract.params.text];
  const label = req.query[config.odin.api.extract.params.label];
  if (label) {
    data[config.odin.api.extract.params.label]   = label;
    console.log(`label: ${label}`);
  }
  console.log(data);
  axios.get(`${config.odin.api.baseUrl}/extract`, {
    headers: { 'Access-Control-Allow-Origin': '*' },
    params: data,
    responseType: 'json'
  }).then(results => {
    console.log(results.data);
    res.json(results.data)
  }).catch(error => {
    console.log(error.response)
    res.json(error.response.data)
  });
});

// Delegate the rest to React router
app.get('*', function(req, res) {
  //console.log(`__dirname: ${__dirname}`);
  res.sendFile(path.resolve('dist/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  });
});

app.listen(config.port, () => console.log(`Listening on port ${config.port}!`));
