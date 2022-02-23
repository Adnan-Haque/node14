const express = require('express');
const app = express();

app.get('/' , (req,res)=>{
    res.render("home.ejs");
})

app.listen(process.env.port || 8080 , () => {
    console.log("server has started at 8080");
})