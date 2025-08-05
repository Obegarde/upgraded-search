
const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');
const searchResults = document.querySelector('#search-results');
searchInput.select()
searchButton.addEventListener("click", startSearch)
searchInput.addEventListener("keydown", (event) => {
  if (event.key == 'Enter') {
    startSearch()
  }
});

async function startSearch() {
  console.log('button clicked')
  const searchParams = new URLSearchParams({ query: searchInput.value.split(' ') }).toString();
  const url = `http://localhost:3000/search?${searchParams}`
  const response = await fetch(url)
  console.log(response)
  if (!response.ok) {
    searchResults.innerText = `status code:${response.status}`
  } else {
    const searchJSON = JSON.parse(await response.text())
    for (let i = 0; i < 10 && i < searchJSON.length; i++) {
      addResultDisplay(searchJSON[i], searchResults)
    }
  }
}

function addResultDisplay(resultJSON, resultElement) {
  const newLink = document.createElement('a')
  newLink.setAttribute('href', resultJSON.url)
  newLink.setAttribute('class', 'result')

  const newHeading = document.createElement('h3')
  const headingText = document.createTextNode(resultJSON.title)
  newHeading.appendChild(headingText)

  const newParagraph = document.createElement('p')
  const paragraphText = document.createTextNode(resultJSON.description)
  newParagraph.appendChild(paragraphText)

  newLink.appendChild(newHeading)
  newLink.appendChild(newParagraph)
  resultElement.appendChild(newLink)
}



