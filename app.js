const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  })); 

app.set('view engine', 'ejs');
app.use(express.static("public"));

const {getObj} = require('./s3')

app.use(bodyParser.json());
const pool = require('./db');

app.get("/", async (req, res) => {
    try {
        pool.query('select * from Books;' , async function(err, results , fields){
            if(err){
                console.log(err);
            }
            results = JSON.parse(JSON.stringify(results));
            // console.log(results)
            const bookValues = await getBooks();
            async function getBooks(){
                let books = []
                for (const book of results){
                    const images = await getObj(book.title)
                    // bookValues.push({images , title})
                    // console.log(book.title)
                    // console.log("starting exec \n")
                    // console.log(images)
                    books.push({images: images, title: book.title})
                }
                return books
            }
            console.log("this is book values " , bookValues)
            res.render("home.ejs" , {books : results , bookValues: bookValues})
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