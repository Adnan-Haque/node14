const mysql = require("mysql");
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.AWS_RDB_HOST,
    port: "3306",
    user: process.env.AWS_RDB_USER,
    password: process.env.AWS_RDB_PASSWORD,
    database: process.env.AWS_RDB_DB,
});

db.connect((err) =>{
    if(err){
        console.log(err.message);
        return err
    }
    console.log("Database Connected");
})

module.exports = db;