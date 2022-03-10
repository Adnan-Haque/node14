var express = require('express');
var pool = require('../db');
// require('dotenv')

const booksRouter = express.Router();

const {getImages} = require('../s3')

booksRouter.get('/:title' , async (req,res) => {
    const {title} = req.params;
    const data = await getImages(title);
    pool.query(`select title, Description , writer, availability from Books where title = '${title}'` ,(err , results) => {
        if(err){
            console.log(err)
        }
        results = JSON.parse(JSON.stringify(results));
        console.log("this is result" , results)
        res.render('bookDetails.ejs' , {images: data , values: results[0]})
    })
})

module.exports = booksRouter;