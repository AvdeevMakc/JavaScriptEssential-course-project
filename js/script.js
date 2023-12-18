
let timerId;

clockStart();

function update() {
    let clock = document.querySelector("#clock");
    let date = new Date(); // (*)
    let hours = date.getHours();
    if (hours < 10) hours = '0' + hours;
    clock.children[0].innerHTML = hours;

    let minutes = date.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    clock.children[1].innerHTML = minutes;

    let seconds = date.getSeconds();
    if (seconds < 10) seconds = '0' + seconds;
    clock.children[2].innerHTML = seconds;
}

function clockStart() { // запустить часы
    timerId = setInterval(update, 1000);
    update();
}

//=============NEWS===============
let newsKey = "ed21b02f5e7c627d51cb5a71299ce1de";
let newsUrl = `https://gnews.io/api/v4/top-headlines?category=general&lang=uk&apikey=${newsKey}`;

let pushNews = document.querySelector(".article__news");
let newsArray = [];
// let myAuthors = ["Ukrinform", "Еспресо", "Радіо Свобода", "Корреспондент.net", "Interfax-Ukraine", "Бізнес Цензор", "Економічна правда"];
let promiseNews = fetch(newsUrl);

start();

function start() {
    promiseNews
        .then(response => response.json())
        .then(json => showNews(json))
        .catch(error => console.error(error.message));
}


function showNews(news) {

    // myAuthors.forEach(author => {
    //     newsArray = newsArray.concat(news.articles.filter(elem => elem.author == author))
    // });

    // for (let i = 0; i < news.length, i++) {
    //     if (myAuthors.includes)
    // }

    // myAuthors.forEach(author => {
    //     console.log(`filtered by ${author}`, news.articles.filter(elem => elem.author == author))
    //     newsArray = newsArray.concat(news.articles.filter(elem => elem.author == author))
    // });

    news.articles.forEach(item => {
        const htmlNews = `<div class="news__urlToImage">
        <img src="${item.image}"
            alt="pic">
        <div class="news__title"><a href="${item.url}" target="_blank">
                <h4>"${item.title}"</h4>
            </a>
        </div>
        <div class="news__description">
            <p> ${item.description}</p>
        </div>
        <div class="news__author">
        <a href="${item.source.url}" target=_blank">
            <p>${item.source.name}</p>
            </a>
            <p>${item.publishedAt}</p>
        </div>
    </div>
    </div>`;

        pushNews.insertAdjacentHTML("beforeend", htmlNews);
    })
}





