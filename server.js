/*********************************************************************************
*  WEB322 – Assignment 07
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
 
*  Name: _KHAI BINH NGUY    Student ID: ____126463165___    _ Date: ___12/19/2017________   
*
*  Online (Heroku) Link:https://last-assignment-web322.herokuapp.com/
*
********************************************************************************/ 
const dataServiceComments = require("./data-service-comments.js");
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
var dataService = require("./data-service.js");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
var clientSessions = require("client-sessions"); 
var dataServiceAuth = require("./data-service-auth.js");



 // Setup client-sessions 
 app.use(clientSessions({   
   cookieName: "session", // this is the object name that will be added to 'req'   
   secret: "web322_A7", // this should be a long un-guessable string. 
   duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)   
   activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute) 
})); 
//middleware function 
app.use(function(req, res, next) {   res.locals.session = req.session;   next(); 
});  
function ensureLogin(req, res, next) { 
  if (!req.session.user) {     res.redirect("/login"); 
  } else { 
    next(); 
  } 
}  

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
    dataServiceComments.getAllComments()
    .then((dataFromPromise)=>{
        res.render("about", {data: dataFromPromise});
    })
    .catch(()=>{
        res.render("about")
    });
});

//setup new routes for as3
app.get("/employees",ensureLogin,  (req,res)=>{
  if(req.query.status){ //check the status
    dataService.getEmployeesByStatus(req.query.status).then((data)=>{
    res.render("employeeList", { data: data, title: "Employees" }); 
  }).catch((err)=>{
    res.render("employeeList", { data: {}, title: "Employees" }); 
  });
  }else if(req.query.department){ //check the department
    dataService.getEmployeesByDepartment(req.query.department).then((data)=>{
   res.render("employeeList", { data: data, title: "Employees" }); 
  }).catch((err)=>{
   res.render("employeeList", { data: {}, title: "Employees" });
  });
  }else if (req.query.manager){//check the manager
    dataService.getEmployeesByManager(req.query.manager).then((data)=>{
    res.render("employeeList", { data: data, title: "Employees" }); 
  }).catch((err)=>{
   res.render("employeeList", { data: {}, title: "Employees" });
  });
  }else{ //check /employees
    dataService.getAllEmployees().then((data)=>{
    res.render("employeeList", { data: data, title: "Employees" }); 
  }).catch((err)=>{
   res.render("employeeList", { data: {}, title: "Employees" });
  });
  }
});

app.get("/employee/:eNum", ensureLogin, (req, res) => {
  
    // initialize an empty object to store the values
    let viewData = {};
    dataService.getEmployeeByNum(req.params.eNum)
    .then((data) => {
      viewData.data = data; //store employee data in the "viewData" object as "data"
    }).catch(()=>{
      viewData.data = null; // set employee to null if there was an error 
    }).then(dataService.getDepartments)
    .then((data) => {
      viewData.departments = data; // store department data in the "viewData" object as "departments"
      
        // loop through viewData.departments and once we have found the departmentId that matches
        // the employee's "department" value, add a "selected" property to the matching 
        // viewData.departments object
  
       for (let i = 0; i < viewData.departments.length; i++) {
          if (viewData.departments[i].departmentId == viewData.data.department) {t6t
            viewData.departments[i].selected = true;
          }
        }
    }).catch(()=>{
      viewData.departments=[]; // set departments to empty if there was an error
    }).then(()=>{
        if(viewData.data == null){ // if no employee - return an error
            res.status(404).send("Employee Not Found");
        }else{
          res.render("employee", { viewData: viewData }); // render the "employee" view
        }
    });
  });
  
  
//check /managers
app.get("/managers",ensureLogin, (req,res)=>{ 
  dataService.getManagers().then((data)=>{
    res.render("employeeList", { data: data, title: "Employees (Managers)" });
  }).catch((err)=>{
    res.render("employeeList", { data: {}, title: "Employees (Managers)" });
  });
});
//check departments
app.get("/departments",ensureLogin, (req,res)=>{ 
  dataService.getDepartments().then((data)=>{
    res.render("departmentList", { data: data, title: "Departments" });
  }).catch((err)=>{
    res.render("departmentList", { data: {}, title: "Departments" });
  });
});
//Add route /employees/add
app.get("/employees/add", ensureLogin, (req,res) => {
  dataService.getDepartments()
  .then((data)=>{
      res.render("addEmployee", {departments: data});
  }).catch(function(err){
      res.render("addEmployee", {departments: []});
  });
});

//Add route /departments/add
app.get("/departments/add", ensureLogin, (req,res) => {
  res.render("addDepartment");
});
//as7 rout add-on
//add route /login
app.get("/login", (req, res) => {
  res.render("login");
});

//add route /register
app.get("/register", (req, res) => {
  res.render("register");
});

//add route /logout
app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect('/');
});

//POST Route for AddEmployee
app.post("/employees/add",ensureLogin,  (req, res) => {
    dataService.addEmployee(req.body).then(()=>{
     res.redirect("/employees"); 
    });
});
//POST Route for AddDepartment
app.post("/departments/add",ensureLogin,  (req, res) => {
  dataService.addDepartment(req.body).then((data)=>{
   res.redirect("/departments"); 
  });
});
//POST Route for UpdateEmployee
app.post("/employee/update", ensureLogin, (req, res)=>{
    dataService.updateEmployee(req.body).then(()=>{
      res.redirect("/employees");
  });
});
//POST Route for UpdateDepartments
app.post("/department/update", ensureLogin, (req, res)=>{
  dataService.updateDepartment(req.body).then((data)=>{
    res.redirect("/departments");
});
});

app.get("/department/:departmentId", ensureLogin, (req, res)=>{
  dataService.getDepartmentById(req.params.departmentId)
      .then((data)=>{
          res.render("department", {data: data});
      })
      .catch((err)=>{
          res.status(404).send("Department Not Found!");
      });
});

app.get("/employee/delete/:empNum",ensureLogin,  (req, res)=>{
  dataService.deleteEmployeeByNum(req.params.empNum)
      .then((data)=>{
          res.redirect("/employees");
      })
      .catch(function(err){
          res.status(500).send("Unable to Remove Employee")
      })
});

//POST /about/addComment
app.post("/about/addComment", (req, res)=>{
    dataServiceComments.addComment(req.body)
    .then(()=>{
        res.redirect("/about");
    })
    .catch((err)=>{
        console.log(err);
        res.redirect("/about");
    });
});

//POST /about/addReply
app.post("/about/addReply", (req, res)=>{
    dataServiceComments.addReply(req.body)
    .then(()=>{
        res.redirect("/about");
    })
    .catch((err)=>{
        console.log(err);
        res.redirect("/about");
    });
});

//as7 POST
//post /register
app.post("/register", (req, res) => {
  dataServiceAuth.registerUser(req.body)
  .then(() => {
    res.render("register", {successMessage: "User created"} )
  }).catch((err)=>{
    res.render("register",{errorMessage: err, user: req.body.user} );
  });
});

//POST /login
app.post("/login", (req, res) => {
  dataServiceAuth.checkUser(req.body)
  .then(() => {
    req.session.user = {
      user: req.body.user
    }
    res.redirect("/employees");
  }).catch((err) => {
      res.render("login", {errorMessage: err, user: req.body.user});
  });
});

//Return error message - put at the end for use() function
app.use((req,res)=>{
  res.status(404).send("Sorry! \n Message 404: Your Page is Not Found =.=!");
});

dataService.initialize().then(()=>{
    dataServiceComments.initialize();
    dataServiceAuth.initialize();
    }).then(()=>{
    app.listen(HTTP_PORT,listenMsg);
    })
    .catch((err)=>{
    console.log(err);
    });
   