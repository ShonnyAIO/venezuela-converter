/* Author: Jonathan Torres */

const dropList = document.querySelectorAll('.drop-list select'),
    fromCurrency = document.querySelector('.from select'),
    toCurrency = document.querySelector('.to select'),
    getButton = document.querySelector('.calculate');

for (let i = 0; i < dropList.length; i++) {
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target);
    });
}

window.addEventListener("onload", () => {
    getExchangeRate();
});

getButton.addEventListener("click", e => {
    e.preventDefault();
    getExchangeRate();
});

const exchangeIcon = document.querySelector('.drop-list .icon');
exchangeIcon.addEventListener("click", () => {
    let temCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

function loadFlag(element) {
    for (code in country_list) {
        if (code == element.value) {
            let imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://www.worldometers.info/img/flags/${country_list[code]}-flag.gif`;
        }
    }
}

var price_dollar = '';
var price_euro = '';
async function getDollar() {
    const dollar_html = document.querySelector('.precio-bcv');
    const euro_html = document.querySelector('.precio-euro');
    let url = `https://query-monitor-crud.vercel.app/prices-bcv`;
    await fetch(url).then(response => response.json()).then(result => {
        const fecha = new Date().toLocaleDateString();
        const hour = new Date().toLocaleTimeString('es-VE');
        let precio_dollar = Number(result.dollar);
        let precio_euro = Number(result.euro);
        price_dollar = precio_dollar.toFixed(2);
        price_euro = precio_euro.toFixed(2);
        getButton.innerText = "Calcular el cambio";
        dollar_html.innerHTML = `BCV 1$ = ${price_dollar} BSD`;
        euro_html.innerHTML = `BCV 1€ = ${price_euro} BSD <br/> <span> Fecha: ${fecha} ${hour} </span>`;
    }).catch(() => {
        dollar_html.innerHTML = "Lo sentimos, la fuente de consulta no funciona";
    });
}

var price_enparalelo = '';
async function getEnparalelo() {
    const enparalelo_html = document.querySelector('.precio-enparalelo');
    let url = `https://monitor-dollar-api.vercel.app/dollar-paralelo`;
    await fetch(url).then(response => response.json()).then(result => {
        let precio = Number(result.precio);
        price_enparalelo = precio.toFixed(2);
        enparalelo_html.innerHTML = `EnParalelo 1$ = ${precio} BSD <br/>`;
    }).catch(() => {
        enparalelo_html.innerHTML = "Lo sentimos, la fuente de consulta no funciona";
    })
}

function getExchangeRate() {
    const amount = document.querySelector(".amount input"),
        exchangeRateTxt = document.querySelector('.exchange-rate'),
        exchangeRateTxt_2 = document.querySelector('.exchange-rate-2');

    amount.innerHTML = '';
    exchangeRateTxt.innerHTML = '';
    exchangeRateTxt_2.innerHTML = '';

    let amountVal = amount.value;
    if (amountVal == "" || amountVal == "0") {
        amount.value = "1";
        amountVal = 1;
    }

    if (amountVal <= -1) {
        amountVal = amountVal * (-1);
    }

    if (amountVal >= 1000000) {
        amountVal = amountVal / 1000000;
    }

    if (fromCurrency.value === toCurrency.value) {
        return exchangeRateTxt.innerText = "No se puede cambiar la misma moneda";
    }

    exchangeRateTxt.innerText = "Calculando el cambio ...";

    if (toCurrency.value == 'REF' || fromCurrency.value == 'REF') {
        let exchangeRate = 1 / price_dollar;
        let exchangeRate_2 = 1 / price_enparalelo;
        let totalExchangeRate;
        let totalExchangeRate_2;
        if (fromCurrency.value == 'REF') {
            totalExchangeRate = (amountVal / exchangeRate).toFixed(2);
            totalExchangeRate_2 = (amountVal / exchangeRate_2).toFixed(2);
        } else {
            totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
            totalExchangeRate_2 = (amountVal * exchangeRate_2).toFixed(2);
        }
        exchangeRateTxt.innerHTML = `Cambio total para BCV: <br/> ${amountVal} ${fromCurrency.value} = <input id='data' type='text' class='results' value='${totalExchangeRate}'> ${toCurrency.value} <button id='copy' class='copy-results'> Copiar resultado BCV</button>`;
        exchangeRateTxt_2.innerHTML = `Cambio total para EnParalelo: <br/> ${amountVal} ${fromCurrency.value} = <input id='data-2' type='text' class='results' value='${totalExchangeRate_2}'> ${toCurrency.value} <button id='copy-2' class='copy-results-2'> Copiar resultado ENPARALELO</button>`;

        document.querySelector("#copy").addEventListener("click", e => {
            e.preventDefault();
            copy();
        });

        document.querySelector("#copy-2").addEventListener("click", e => {
            e.preventDefault();
            copy2();
        });

    } else if (toCurrency.value == 'EUR' || fromCurrency.value == 'EUR') {
        let exchangeRate = 1 / price_euro;
        let totalExchangeRate;
        if (fromCurrency.value == 'EUR') {
            totalExchangeRate = (amountVal / exchangeRate).toFixed(2);
        } else {
            totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
        }

        exchangeRateTxt.innerHTML = `Cambio total para BCV: <br/> ${amountVal} ${fromCurrency.value} = <input id='data' type='text' class='results' value='${totalExchangeRate}'> ${toCurrency.value} <button id='copy' class='copy-results'> Copiar resultado Euro</button>`;

        document.querySelector("#copy").addEventListener("click", e => {
            e.preventDefault();
            copy();
        });
    }


}

function copy() {
    let copyText = document.querySelector("#data");
    copyText.select();
    document.execCommand("copy");
    let advise = document.querySelector('.copy-results');
    advise.innerHTML = 'Monto copiado exitosamente';
}

function copy2() {
    let copyText = document.querySelector("#data-2");
    copyText.select();
    document.execCommand("copy");
    let advise = document.querySelector('.copy-results-2');
    advise.innerHTML = 'Monto copiado exitosamente';
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("/sw.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
    })
}


getEnparalelo();
getDollar();


