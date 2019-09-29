/* eslint-disable */
var firebase = require('firebase');
var Axios = require('axios');
var FirebaseConfig = require('./firebaseConfig.json');

class Firebase {

    constructor(){

        if(!firebase.apps.length) firebase.initializeApp(FirebaseConfig)
    }

    saveFinance(route = '', data, callback){
        this.userLogged(user => {

            if(user){
                firebase
                    .database()
                    .ref( '/finance/' + route)
                    .set(data, callback)
            }
    
            else {    
                callback(false);
            }
            
        })
    }

}

export default new Firebase()