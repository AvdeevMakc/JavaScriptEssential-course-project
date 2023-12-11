
let select1 = document.querySelector("#converterSelectFirst");
let select2 = document.querySelector("#converterSelectSecond");
let showResultNow = document.querySelector("#showResultNow");
let showCoursNow = document.querySelector("#showCoursNow");
let converterInputFirst = document.querySelector("#converterInputFirst");
let converterInputSecond = document.querySelector("#converterInputSecond");
let converterBox = document.querySelector(".converter__box");

let urlCurrency = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json";

let fullCurrencyArray = [];
let hryvnia = { txt: 'Українська гривня', rate: 1, date: '' };

// exchangedate: "11.12.2023"
// rate:39.601
// txt:"Євро"

let promise = fetch(urlCurrency);

promise
    .then(response => response.json())
    .then(json => createValuteArray(json))
    .catch(error => console.log(error.message));

function createValuteArray(array) {
    fullCurrencyArray = array.map(val => {
        return {
            txt: `${val.txt}`,
            rate: `${val.rate}`,
            date: `${val.exchangedate}`
        }
    })
    fullCurrencyArray.push(hryvnia);
    showCurrency(fullCurrencyArray);
}

function showCurrency(array) {
    array.forEach(val => {
        // console.log(val);
        let option1 = document.createElement("option");
        let option2 = document.createElement("option");

        option1.textContent = val.txt;
        if (val.txt == "Українська гривня") option1.selected = true;
        option2.textContent = val.txt;
        if (val.txt == "Євро") {
            option2.selected = true;
        }

        select1.append(option1);
        select2.append(option2);
    })
};

converterBox.addEventListener("input", function (e) {
    // if (e.target.nodeName != "input" && e.target.nodeName != "select") return;

    showResult();
    // console.log(e.target.value);
})

function showСourse(val) {
    showCoursNow.innerHTML = `${val.rate} ${val.txt} `;
}

function showResult() {
    // получение курса с select
    let first = returnCours(converterSelectFirst.value);
    let second = returnCours(converterSelectSecond.value);

    let result = (converterInputFirst.value * first) / second;

    showResultNow.innerHTML = `Result ${result}`;

    showCoursNow.innerHTML = `Exchange rate - ${first / second}`;
}

function returnCours(text) {
    let x;
    fullCurrencyArray.forEach(val => {
        if (text == val.txt) x = val.rate;
    })
    return x;
}









