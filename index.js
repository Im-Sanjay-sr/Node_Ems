//imports
const express = require('express') ;
require('dotenv').config();
const session = require("express-session");
const {connectUserDb1} = require("./config/dbConnection") ;
const regroutes = require("./routes/regroutes");
const employeroutes = require("./routes/employeroutes");

const app = express(); 
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(express.urlencoded({ extended: true })); //



const PORT = process.env.PORT || 3000 ;

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectUserDb1();
app.set("view engine" , "ejs");
app.use(
    session ({
        secret : "My secret key",
        saveUninitialized : true ,
        resave : false ,
    })
);





app.use(express.static(__dirname + '/assets'));

app.use("/" , regroutes)
app.use("/employees" ,employeroutes)

app.listen(PORT , () => {
    console.log(`Server is listening @ localhost:${PORT}`)
})
