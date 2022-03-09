const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  })); 


app.use(bodyParser.json());
const pool = require('./db');

app.get("/", async (req, res) => {
    try {
        pool.query('select * from Books;' , function(err, results , fields){
            if(err){
                console.log(err);
            }
            results = JSON.parse(JSON.stringify(results));
            res.render("home.ejs" , {books : results})
        });
    } catch (err) {
        console.log(err);
    }
});

app.use('/books/', require('./routes/books'));
app.use('/admin/' , require('./routes/admin'));

app.listen(process.env.port || 8080 , () => {
    console.log("server has started at 8080");
})