const { GoogleGenAI } = require('@google/genai');
const express = require('express');
const app = express();
const ai = new GoogleGenAI();

app.use(express.static('public'));
app.listen(3000, () => console.log('Server running'));
app.get('/search', async (req, res) => {
  const searchKey = process.env.brave_key
  const searchJSON = await getWebSearchJSON(req, searchKey)
  res.send(JSON.stringify(searchJSON.web.results))
});


async function getAiSummary(pageText, searchQuery) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: pageText,
    config: ai.types.generateContentConfig({ systemInstruction: "You are part of a search engine. You have to look at the page and give a recommendation on whether it is a good up to date resource for the given query. Give a summary and your verdict in 5 lines." })
  });
}

function createURL(req) {
  const queryJoined = req.query['query'].split(',').join('+')
  const url = `https://api.search.brave.com/res/v1/web/search?q=${queryJoined}&count=5`
  return url
}
function createHeader(key) {
  const searchHeaders = new Headers();
  searchHeaders.append("Content-Type", "application/json");
  searchHeaders.append("X-Subscription-Token", key);
  searchHeaders.append("Accept-Encoding", "gzip");
  return searchHeaders
}

async function getWebSearchJSON(req, apiKey) {
  const url = createURL(req)
  const searchHeaders = createHeader(apiKey)
  const searchResponse = await fetch(url, { method: "GET", headers: searchHeaders });
  const searchJSON = await searchResponse.json()
  return searchJSON
}

