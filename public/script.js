
const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');
const searchResults = document.querySelector('#search-results');
searchButton.addEventListener("click", startSearch)


async function startSearch() {
  console.log('button clicked')
  const url = `http://localhost:3000/search?${searchInput.value}`
  const response = await fetch(url)
  console.log(response)
  if (!response.ok) {
    searchResults.innerText = `status code:${response.status}`
  } else {
    searchResults.innerText = await response.text();
  }
}



