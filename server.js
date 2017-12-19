/*********************************************************************************
*  WEB322 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
 
*  Name: _KHAI BINH NGUY    Student ID: ____126463165___    _ Date: ___12/19/2017________   
*
*  Online (Heroku) Link:  https://salty-tor-67088.herokuapp.com/
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
var dataService = require("./data-service.js");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

//for returning css/site.css file
app.use(express.static('public'));
//ensure that the bodyParser middleware will work correctly
//allow the .hbs extensions to be properly handled
app.use(bodyParser.urlencoded({ extended: true }));
app.engine(".hbs", exphbs({
  extname: ".hbs",
  defaultLayout: 'layout',
  helpers: {
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
}));
app.set("view engine", ".hbs");



// message listen func:
var listenMsg=()=>{
  console.log("Express http server listening on: " + HTTP_PORT);
}
     
// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", (req,res)=>{
   res.render("home");
});

// setup another route to listen on /about
app.get("/about", (req,res)=>{
    res.render("about");
});

//Return error message - put at the end for use() function
app.use((req,res)=>{
    res.status(404).send("Sorry! \n Message 404: Your Page is Not Found =.=!");
  });
  
dataService.initialize().then((data)=>{
      app.listen(HTTP_PORT,listenMsg);
      })
      .catch((err)=>{
      console.log(err);
      });