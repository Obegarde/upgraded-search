const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.static('public'));
app.listen(3000, () => console.log('Server running'));
app.get('/search', async (req, res) => {
  const searchParams = new URLSearchParams(req.query)
  console.log(searchParams.values())

  res.send('testString')
});
