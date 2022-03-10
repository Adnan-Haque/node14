var express = require('express');
var pool = require('../db');

const adminRouter = express.Router();
const { upload }  = require('../s3');

adminRouter.get('/uploadBooks' ,async (req,res) => {
    let valGenre = []
    pool.query(`select * from Genres`,async function(err, results){
        if(err){
            console.log(err)
        }
        results = JSON.parse(JSON.stringify(results));
        getGenres(results)
    });
    function getGenres(values){
        if(Array.isArray(values)){
            values.forEach(element => {
                valGenre.push(element)
            });
            res.render("admin/uploadBooks.ejs" , {genre: valGenre});
        }
        else{
            valGenre.push({values});
            console.log(valGenre);
            res.render("admin/uploadBooks.ejs" , {genre: valGenre});
        }
        // console.log("this is genre" , valGenre);
    }
    // console.log("this is genre" , valGenre)
})
.post('/uploadBooks',upload.array("ImageUpload" , 5), (req , res) =>{
    try {
        const title = req.body.title;
        const desc = req.body.desc;
        const avail = req.body.avail;
        const sold = req.body.sold;
        const writer = req.body.writer;
        const genre = req.body.genre
        // console.log("finding elements " , title , desc , avail , sold , writer);
        pool.query(`insert into Books (title , Description , Availability,sold , writer) values ('${title}' , '${desc}' , ${avail} , ${sold} , '${writer}') ;` , function(err, results , fields){
            if(err){
                console.log(err);
            }
            console.log(results);
            pool.query(`select last_insert_id() as id; ` , function(err , results){
                if(err){
                    console.log(err)
                }
                results = JSON.parse(JSON.stringify(results));
                // console.log(results)
                // console.log(results[0].id )
                if(Array.isArray(genre)){
                    genre.forEach(function(ele){
                        pool.query(`insert into BookGenre (BookId , GenreId) values (${results[0].id},${ele})`)
                    })
                    
                }
                else{
                    // console.log("this is genre" , genre)
                    pool.query(`insert into BookGenre (BookId , GenreId) values (${results[0].id},${genre})`, function(err){
                        if(err){
                            console.log(err);
                        }
                    })
                }
            })
        });
        // console.log(req.body.genre);
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }
})

module.exports = adminRouter;