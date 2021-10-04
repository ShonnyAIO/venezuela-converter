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
            imgTag.src = `https://www.countryflags.io/${country_list[code]}/flat/64.png`;
        }
    }
}

var price_dollar = '';
function getDollar() {
    let url = `https://dollar-bcv-query.herokuapp.com/dollar-bcv/`;
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRateTxt = document.querySelector('.exchange-rate');
        let fecha = new Date().toLocaleDateString();
        let precio = Number(result.precio);
        const dollar_html = document.querySelector('.precio-bcv');
        price_dollar = precio;
        exchangeRateTxt.innerText = "";
        dollar_html.innerHTML = `Tasa del dia: ${precio.toFixed(4)} BS.D <br/> <span> Fecha: ${fecha} </span>`;
    }).catch(() => {
        dollar_html.innerHTML = "Algo no esta funcionando";
    });
}

function getExchangeRate() {
    const amount = document.querySelector(".amount input"),
        exchangeRateTxt = document.querySelector('.exchange-rate');
    let amountVal = amount.value;
    if (amountVal == "" || amountVal == "0") {
        amount.value = "1";
        amountVal = 1;
    }

    if (amountVal >= 1000000) {
        amountVal = amountVal / 1000000;
    }

    if (fromCurrency.value === toCurrency.value) {
        return exchangeRateTxt.innerText = "No se puede cambiar la misma moneda";
    }

    exchangeRateTxt.innerText = "Calculando el cambio ...";
    let exchangeRate = 1 / price_dollar;
    let totalExchangeRate;
    if (fromCurrency.value == 'USD') {
        totalExchangeRate = (amountVal / exchangeRate).toFixed(2);
    } else {
        totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
    }
    exchangeRateTxt.innerHTML = `Cambio total: <br/> ${amountVal} ${fromCurrency.value} = <input id='data' type='text' class='results' value='${totalExchangeRate}'> ${toCurrency.value} <button id='copy' class='copy-results'> Copiar resultado</button>`;
    document.querySelector("#copy").addEventListener("click", e => {
        e.preventDefault();
        copy();
    });

}

function copy() {
    var copyText = document.querySelector("#data");
    copyText.select();
    document.execCommand("copy");
    let advise = document.querySelector('.copy-results');
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

getDollar();
