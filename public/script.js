main();

function main() {
  const currentPage = document.body.dataset.page;
  if (currentPage === 'serp') {
    const resultElements = document.querySelectorAll('.serp__result');
    console.log(resultElements.length)
    const urlParams = new URLSearchParams(window.location.search)
    const searchInput = urlParams.get('q')
    startSearch(resultElements, searchInput)
  }
}

function hashSearchInput(searchInputValue) {
  let hash = 0;
  for (let i = 0; i < searchInputValue.length; i++) {
    hash += searchInputValue.charCodeAt(i)
  }
  return hash % 64
}

function addToLocalStorage(searchInputValue, result) {
  console.log(`add:${searchInputValue}`)
  const hashedInput = hashSearchInput(searchInputValue)
  localStorage.setItem(hashedInput, result)
}

function getFromLocalStorage(searchInputValue) {
  console.log(`get: ${searchInputValue}`)
  const hashedInput = hashSearchInput(searchInputValue)
  const itemFromStorage = JSON.parse(localStorage.getItem(hashedInput))
  console.log(itemFromStorage)
  return itemFromStorage
}


function hideElements(elements) {
  elements.every((element) => element.style.display = 'none')
}

async function startSearch(resultElements, searchInput) {
  console.log('search initiated')
  const cachedResult = getFromLocalStorage(searchInput)
  console.log(cachedResult)
  if (cachedResult == null) {
    const url = `http://localhost:3000/search?q=${searchInput}`
    const response = await fetch(url)
    console.log(response)
    if (!response.ok) {
      hideElements(resultElements)
    } else {
      const searchText = await response.text()
      addToLocalStorage(searchInput, searchText)
      document.querySelector('.serp__no-results').style.display = 'none';
      addResultDisplay(JSON.parse(searchText), resultElements)

    }
  } else {
    addResultDisplay(cachedResult, resultElements)
    document.querySelector('.serp__no-results').style.display = 'none';
  }

}

function addResultDisplay(resultsJSON, resultElements) {
  for (let i = 0; i < resultElements.length; i++) {
    const currentResult = resultsJSON.results[i]
    resultElements[i].querySelector('a').setAttribute('href', currentResult.url);
    resultElements[i].querySelector('.serp__title').innerText = currentResult.title;
    resultElements[i].querySelector('.serp__url').innerText = currentResult.url;
    resultElements[i].querySelector('.serp__description').innerText = currentResult.summary;
  }
}



