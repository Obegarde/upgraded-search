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
      searchButton.addEventListener("click", startSearch);
      async function startSearch() {
        console.log("button clicked");
        const url = `http://localhost:3000/search?${searchInput.value}`;
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
