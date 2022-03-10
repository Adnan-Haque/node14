var express = require('express');
var pool = require('../db');
// require('dotenv')

const booksRouter = express.Router();

const {getImages} = require('../s3')

booksRouter.get('/:title' , async (req,res) => {
    const {title} = req.params;
    const data = await getImages(title)
    // console.log(data)
    res.render('bookDetails.ejs' , {data: data})
})

module.exports = booksRouter;