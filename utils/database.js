const mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'username',
  password: 'your-password'
});

connection.connect(function(err){
  if(err) throw err;
  console.log("CONNECTED!");
})