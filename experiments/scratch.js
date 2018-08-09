const fs = require('fs');
const utils = require("../utils");
const mysql = require('mysql');
const stream = fs.createReadStream('./scratch.sql');

// var connection = mysql.createConnection({
//     multipleStatements: true,
//     host: 'localhost',
//     user: 'root',
//     password: 'root'
// });
// stream.on('data', (data) => {
//     console.log(data.toString('utf8'));
//     connection.query(data.toString('utf8'), function (error, result, field) {
//         if (error) {
//             console.log(error);
//             return;
//         }
//         console.log(result)
//     })
//     connection.end();
// });
// stream.on('end', () => {
//     console.log('end');
// });

var json = JSON.parse(fs.readFileSync('./test.json', 'utf8'));
console.log(json.local)

console.log(utils.fileExists('./test.json'));
