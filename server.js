const express = require('express');
const app = express();

app.use(express.static('public'));
app.listen(3000, () => console.log('Server running'));
app.get('/search?:', async (req, res) => {
  res.send('testString')
});
