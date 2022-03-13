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
        let bestSeller = []
        let business = []
        let action = []
        let horror = []
        let biography = []
        let scienceFiction = []
        let recent = []
        async function getBooks(values){
            let books = []
            for await (const book of values){
                const images = await getObj(book.title)
                books.push({images: images, title: book.title})
            }
            return books
        }
        pool.query('select title from Books order by sold desc limit 4',async function(err , results1 , fields){
            if(err){
                console.log(err)
            }
            results1 = JSON.parse(JSON.stringify(results1));
            // only want title
            bestSeller = await getBooks(results1)
            // console.log("this si best seller" , bestSeller)
            pool.query('select title, sold from Books where idBooks in (select BookId from BookGenre where GenreId = 3) order by sold desc limit 4' , async function(err, results2, fields){
                if(err){
                    console.log(err)
                }
                results2 = JSON.parse(JSON.stringify(results2));
                business = await getBooks(results2)
                // console.log("this is business" , business)
                pool.query('select title, sold from Books where idBooks in (select BookId from BookGenre where GenreId = 1) order by sold desc limit 4' , async function(err, results3, fields){
                    if(err){
                        console.log(err)
                    }
                    results3 = JSON.parse(JSON.stringify(results3));
                    action = await getBooks(results3)
                    // console.log("this is action" , action)
                    pool.query('select title, sold from Books where idBooks in (select BookId from BookGenre where GenreId = 4) order by sold desc limit 4' , async function(err, results4, fields){
                        if(err){
                            console.log(err)
                        }
                        results4 = JSON.parse(JSON.stringify(results4));
                        horror = await getBooks(results4)
                        // console.log("this is horror" , horror)
                        pool.query('select title, sold from Books where idBooks in (select BookId from BookGenre where GenreId = 2) order by sold desc limit 4' , async function(err, results5, fields){
                            if(err){
                                console.log(err)
                            }
                            results5 = JSON.parse(JSON.stringify(results5));
                            biography = await getBooks(results5)
                            // console.log("this is biography" , biography)
                            pool.query('select title, sold from Books where idBooks in (select BookId from BookGenre where GenreId = 5) order by sold desc limit 4' , async function(err, results6, fields){
                                if(err){
                                    console.log(err)
                                }
                                results6 = JSON.parse(JSON.stringify(results6));
                                scienceFiction = await getBooks(results6)
                                // console.log("this is science fiction" , scienceFiction)
                                pool.query('select title from Books order by timestamp desc limit 4' , async function(err, results7, fields){
                                    if(err){
                                        console.log(err)
                                    }
                                    results7 = JSON.parse(JSON.stringify(results7));
                                    recent = await getBooks(results7)
                                    // console.log("this is recent" , recent)
                                    res.render("home.ejs" , {business: business, bestSeller: bestSeller, action:action , horror:horror, biography:biography, scienceFiction: scienceFiction,recent: recent});
                                });
                            });
                        });
                    });
                });
            });
        });


        // await let_render()
        // async function let_render(){
        //     console.log("rendering")
        //     res.render("home.ejs" , {business: business, bestSeller: bestSeller, action: action, horror: horror, biography, biography, scienceFiction: scienceFiction,recent,recent});
        // }
        // pool.query('select * from Books;' , async function(err, results , fields){
        //     if(err){
        //         console.log(err);
        //     }
        //     results = JSON.parse(JSON.stringify(results));
        //     const bookValues = await getBooks();
        //     async function getBooks(){
        //         let books = []
        //         for (const book of results){
        //             const images = await getObj(book.title)
        //             books.push({images: images, title: book.title})
        //         }
        //         return books
        //     }
        //     // console.log("this is book values " , bookValues)
        // });

        // let bestSeller = []
        // let business = []
        // let action = []
        // let horror = []
        // let biography = []
        // let scienceFiction = []
        // let recent = []
        
        // res.render("home.ejs" , {business: business, bestSeller: bestSeller, action: action, horror: horror, biography, biography, scienceFiction: scienceFiction,recent,recent});
    } catch (err) {
        console.log(err);
    }
});

app.use('/books/', require('./routes/books'));
app.use('/admin/' , require('./routes/admin'));

app.listen(process.env.port || 8080 , () => {
    console.log("server has started at 8080");
})