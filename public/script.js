
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
    searchResults.innerText = await response.text();
  }
}



