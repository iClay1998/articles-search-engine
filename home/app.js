(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        const imgRequest = new XMLHttpRequest();

        imgRequest.onload = addImage;
        imgRequest.onerror = function(err) {
          requestError(err, 'image');
        };
        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        imgRequest.setRequestHeader('Authorization', 'Client-ID MZEljzgLtz4aVivG3FUfzvLdDbOodq_rqTpxy-KIZVE');
        imgRequest.send();

        function addImage(){
          let htmlContent = '';
          const data = JSON.parse(this.responseText);

          if (data && data.results && data.results[0]) {
            const firstImage = data.results[0];
            htmlContent = `<figure>
                <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
          } else {
            htmlContent = '<div class="error-no-image">No image available</dive>';
          }

          responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        };

        const articleRequest = new XMLHttpRequest();

        articleRequest.onload = addArticle;
        articleRequest.open('GET', `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=S0AAM2E3ghV5sAJ2sy7OBEGJXuHEYYbL`);
        articleRequest.send();

        function addArticle() {
          let htmlContent = '';
          const data = JSON.parse(this.responseText);

          if (data.response && data.response.docs && data.response.docs.length > 1) {
            responseContainer.scrollIntoView({behavior: "smooth"});
            htmlContent = "<ul>" + data.response.docs.map(article => `<li class="article">
                    <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                    <p>${article.snippet}</p>
                </li>`).join('') + "</ul>"
                //responseContainer.scrollIntoView({behavior: "smooth"});
          } else {
            htmlContent = `<div class="error-no-article">No articles available</dive>`
          }

          responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        };
    });
})();
