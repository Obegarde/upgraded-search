const express = require('express');
const app = express();
const apikey = process.env.brave_key

app.use(express.static('public'));
app.listen(3000, () => console.log('Server running'));
app.get('/search', async (req, res) => {
  const queryJoined = req.query['query'].split(',').join('+')
  const url = `https://api.search.brave.com/res/v1/web/search?q=${queryJoined}`
  console.log(url)
  const searchHeaders = new Headers();
  searchHeaders.append("Content-Type", "application/json");
  searchHeaders.append("X-Subscription-Token", apikey);
  searchHeaders.append("Accept-Encoding", "gzip");
  const searchResponse = await fetch(url, { method: "GET", headers: searchHeaders });
  console.log(await searchResponse.text());
});
