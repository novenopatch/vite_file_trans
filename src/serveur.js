const express = require('express');
const app = express();
const axios = require('axios');

app.get('/download', async (req, res) => {
  const { url } = req.query;
  const response = await axios.get(url, {
    headers: { 'Access-Control-Allow-Origin': '*' },
    responseType: 'stream'
  });
  response.data.pipe(res);
});

app.listen(3000, () => {
  //console.log('Server started at http://localhost:3000');
});
