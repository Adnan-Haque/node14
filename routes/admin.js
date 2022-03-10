var express = require('express');
var pool = require('../db');

const adminRouter = express.Router();
const { upload }  = require('../s3');

adminRouter.get('/uploadBooks' , (req,res) => {
    res.render("admin/uploadBooks.ejs");
})
.post('/uploadBooks',upload.array("ImageUpload" , 5), (req , res) =>{
    try {
        const title = req.body.title;
        const desc = req.body.desc;
        const avail = req.body.avail;
        console.log(title , desc , avail);
        pool.query(`insert into Books (title , Description , Availability) values ('${title}' , '${desc}' , '${avail}') ;` , function(err, results , fields){
            if(err){
                console.log(err);
            }
            console.log(results);
        });
        res.redirect('/admin/uploadBooks');
    } catch (err) {
        console.log(err);
    }
})

module.exports = adminRouter;