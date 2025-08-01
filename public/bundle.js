(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // public/script.js
  var require_script = __commonJS({
    "public/script.js"() {
      var searchInput = document.querySelector("#search-input");
      var searchButton = document.querySelector("#search-button");
      var searchResults = document.querySelector("#search-results");
      searchInput.select();
      searchButton.addEventListener("click", startSearch);
      searchInput.addEventListener("keydown", (event) => {
        if (event.key == "Enter") {
          startSearch();
        }
      });
      async function startSearch() {
        console.log("button clicked");
        const searchParams = new URLSearchParams({ query: searchInput.value.split(" ") }).toString();
        const url = `http://localhost:3000/search?${searchParams}`;
        const response = await fetch(url);
        console.log(response);
        if (!response.ok) {
          searchResults.innerText = `status code:${response.status}`;
        } else {
          searchResults.innerText = await response.text();
        }
      }
    }
  });
  require_script();
})();
