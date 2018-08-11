const fs = require('fs');
const mysql = require('mysql');
const stream = fs.createReadStream('./scratchpad.sql');

// var connection = mysql.createConnection({
//     multipleStatements: true,
//     host: 'localhost',
//     user: 'root',
//     password: 'root'
// });
stream.on('data', (data) => {
  console.log(data.toString('utf8'));
});
// stream.on('end', () => {
//   console.log('end');
// });


