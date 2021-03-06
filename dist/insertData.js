console.log('Started...\n\n');

var firebase = require('firebase');
var axios = require('axios');
var FirebaseConfig = require('./firebaseConfig.json');

var oneHour = 1000 * 60 * 60;

saveDataFirebase();

setInterval(() => {
    saveDataFirebase();
}, oneHour);

function saveDataFirebase(){
    getFinancesData(finance => {
        console.log('GET: ' + getNow());

        let now = getNowFirebase()
        finance.date = now;

        getPETR4Data(petr4 => {

            finance.others = {petr4};
            saveFinance(now.date + '/' + now.hour , finance);

        });
    });
}

function getNow(){

    var today = new Date();
    var hour = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds(); 

    var now = hour + ':' + minutes + ':' + seconds;

    return now
}

function getNowFirebase(){

    var today = new Date();
    var hour = today.getHours();
    var day = today.getDate(); 
    var year = today.getFullYear(); 
    var month = today.getMonth(); 

    var now = {
        date: year + '-' + month + '-' + day,
        year,
        month,
        day,
        hour
    };

    return now
}

function saveFinance(route = '', data, callback){

    if(!firebase.apps.length) firebase.initializeApp(FirebaseConfig)

    firebase
        .database()
        .ref( '/finance/' + route)
        .set(data, callback);
};

function getFinancesData(callback){

    axios
        .get('https://api.hgbrasil.com/finance?key=a9d0104b')
        .then(finances => callback(finances.data.results));
}

function getPETR4Data(callback){

    axios
        .get('https://api.hgbrasil.com/finance/stock_price?key=a9d0104b&symbol=PETR4')
        .then(finances => {

            const {region, name, change_percent} = finances.data.results.PETR4;

            callback({
                location: region,
                name: name,
                variation: change_percent
            })
        });
}