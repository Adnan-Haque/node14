var express = require('express');
var pool = require('../db');

const booksRouter = express.Router();

booksRouter.get('/:id' , (req,res) => {
    const {id} = req.params;
    res.render('bookDetails.ejs',{id: id})
})

module.exports = booksRouter;