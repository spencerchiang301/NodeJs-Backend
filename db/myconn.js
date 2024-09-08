const myConnection = require('./db');

async function selectData(queryString) {
    return new Promise((resolve, reject) => {
        myConnection.query(queryString, (err, rows) => {
            if(err)
                reject(err);
            else
                resolve(rows);
        });
    });
}

async function insertUpdateDeleteData(queryString) {
    return new Promise((resolve, reject) => {
        myConnection.query(queryString, (err, rows) => {
            if(err)
                reject(err);
            else
                resolve(rows);
        });
    });
}


module.exports = {
    selectData,
    insertUpdateDeleteData
}