var express = require('express');
var pool = require('../db');
// require('dotenv')

const booksRouter = express.Router();

const {getImages} = require('../s3')

booksRouter.get('/:title' , async (req,res) => {
    const {title} = req.params;
    // console.log("this is title" , title)
    const data = await getImages(title);
    pool.query(`select title, Description , writer, availability from Books where title = '${title}'` ,async function (err , results){
        if(err){
            console.log(err)
        }
        results = JSON.parse(JSON.stringify(results));
        // console.log("this is data" , data)
        res.render('bookDetails.ejs' , {images: data , values: results[0]})
    })
})

module.exports = booksRouter;