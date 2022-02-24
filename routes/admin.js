var express = require('express');
var pool = require('../db');

const adminRouter = express.Router();

const { upload }  = require('../s3');

adminRouter.get('/uploadBooks' , (req,res) => {
    res.render("admin/uploadBooks.ejs");
})
.post('/uploadBooks' , upload.array("ImageUpload" , 5), (req , res) =>{
    res.send("successful")
    console.log(req.files);
})
module.exports = adminRouter;