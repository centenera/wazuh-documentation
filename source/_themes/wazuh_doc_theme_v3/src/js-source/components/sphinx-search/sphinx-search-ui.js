/* -----------------------------------------------------------------------------
  Search results page
----------------------------------------------------------------------------- */

if ( $('.search') ) {

/* Optinally hiding search results (release note) --------------------------- */
  const searchResults = $('#search-results');

  if (searchResults.length) {
    let lastResult = null;
    let splitURL = null;
    const configAdd = {childList: true};
    let observerResults = null;
    let observerResultList = null;
    let observerResultText = null;
    let i = 0;

    /* Detects every result that is added to the list */
    const addedResult = function(mutationsList, observer) {
      for (i = 0; i < mutationsList.length; i++) {
        if (mutationsList[i].type === 'childList') {
          lastResult = $('ul.search li:last-child');
          splitURL = lastResult.children('a').prop('href').split('/');
          /* Checks the URL to mark the results found in excludedSearchFolders */
          $.each(excludedSearchFolders, function(index, value) {
            if ($.inArray(value, splitURL) !== -1) {
              lastResult.addClass('excluded-search-result'); /* Marks initially excluded result */
              lastResult.addClass('hidden-result'); /* Hides the excluded result */
              return false; /* breaks the $.each loop */
            }
          });

          /* Generate breadcrumb */
          const resultNode = mutationsList[i].addedNodes[0];
          const breadcrumb = createResultBreadcrumb($(resultNode).find('.result-link'));
          breadcrumb.insertAfter($(resultNode).find('.result-link'));
        }
      }
    };

    /* Checks that the list of search results exists */
    const existsResultList = function(mutationsList, observer) {
      for (i = 0; i < mutationsList.length; i++) {
        if (mutationsList[i].type === 'childList' && $(mutationsList[i].addedNodes[0]).hasClass('search')) {
          const ulSearch = $('ul.search');

          observerResults.disconnect();

          observerResultList = new MutationObserver(addedResult);
          observerResultList.observe(ulSearch[0], configAdd);
          observerResultText = new MutationObserver(changeResultText);
          observerResultText.observe($('#search-results > p')[0], configAdd);
        }
      }
    };

    /* Replaces the result message */
    const changeResultText = function(mutationsList, observer) {
      for (i = 0; i < mutationsList.length; i++) {
        if (mutationsList[i].type === 'childList') {
          observerResultText.disconnect();
          const totalResults = $('ul.search li').length;
          const excludedResults = $('ul.search li.excluded-search-result').length;
          let resultText = '';
          if (totalResults > 0) {
            if (excludedResults > 0) {
              resultText = 'Found <span id="n-results">' + (totalResults - excludedResults) + '</span> page(s) matching the search query. <a id="toggle-results" class="include" href="#">Include Release Notes results</a>';
            } else {
              resultText = 'Found <span id="n-results">' + totalResults + '</span> page(s) matching the search query.';
            }
            $('#search-results > p:first').html(resultText);
          }
        }
      }
    };

    observerResults = new MutationObserver(existsResultList);
    observerResults.observe(searchResults[0], configAdd);

  }
}
