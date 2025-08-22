const { GoogleGenAI } = require('@google/genai');
const { convert } = require('html-to-text')
const express = require('express');
const app = express();
const GEMINI_API_KEY = process.env.gemini_key
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

app.use(express.static('public'));
app.listen(3000, () => console.log('Server running'));
app.get('/search', async (req, res) => {
  console.log(req.query)
  const searchKey = process.env.brave_key
  const searchJSON = await getWebSearchJSON(req, searchKey)
  const responseObject = { query: fixQuery(req) }
  responseObject.results = await processSearchResults(searchJSON, fixQuery(req))
  res.send(JSON.stringify(responseObject))
});

async function testAI() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents:
      'Search Query: why+is+the+sky+blue Result Text: Because of magic',
    config: { systemInstruction: "You are part of a search engine. You have to look at the page and give a recommendation on whether it is an understandable,good, up to date resource for the given query. Give a summary and your verdict in 8 lines." },
  });

  console.debug(response.text);
}

async function processSearchResults(searchResultsJSON, searchQuery) {
  const amountOfResultsToProcess = searchResultsJSON.web.results.length;
  const outputResults = []
  for (let i = 0; i < amountOfResultsToProcess; i++) {
    const resultObject = { url: searchResultsJSON.web.results[i].url, title: searchResultsJSON.web.results[i].title }
    try {
      const webResponse = await fetch(searchResultsJSON.web.results[i].url);
      const webText = await webResponse.text()
      const cleanText = convert(webText, { selectors: [{ selector: 'header', format: 'skip' }, { selector: 'footer', format: 'skip' }] })
      try {
        const aiResponseText = await getAiResponseText(cleanText, searchQuery)
        resultObject.summary = aiResponseText
      } catch (error) {
        console.log(error)
        resultObject.summary = convert(searchResultsJSON.web.results[i].description)
      }
      outputResults.push(resultObject)
    } catch (error) {
      console.log(error)
      continue;
    }

  }
  return outputResults
}

async function getAiResponseText(pageText, searchQuery) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Search Query:${searchQuery} Result Text:${pageText}`,
    config: { systemInstruction: "You are part of a search engine. Give a short summary of the page and give a recommendation on whether it is a wellwritten resource for the given query. Give your summary and verdict in 5 lines. Do not add any formatting to your response." },
  });
  return response.text
}


function fixQuery(req) {
  return req.query.q.split(' ').join('+')
}

function createURL(req) {
  const url = `https://api.search.brave.com/res/v1/web/search?q=${fixQuery(req)}&count=5`
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

