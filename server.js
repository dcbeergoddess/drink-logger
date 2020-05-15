// Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql")
const config = require("./config/db")

// Create an instance of the express app.
const app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
const PORT = process.env.PORT || 8080;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


//by default use local settings
const dbCreds = (process.env.NODE_ENV === "production") ? config.production : config.db;
const connection = mysql.createConnection(dbCreds);
connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

// ROUTES
//DO WE WANT TO PUT THESE IN A SEPERATE CONTROLLER FOLDER

// GET/SELECT ALL DRINKS============================

app.get("/", function (req, res) {
  connection.query("SELECT * FROM drinks;", function (err, data) {
    if (err) throw err;
    //NEED TO BREAK DATA DOWN TO JUST HAVE DRINK INFO, using this to test for now
    res.render("index", { drinks: data });
  });
});



//POST/INSERT DRINKS ==============================
app.post("/", function (req, res) {
  connection.query("INSERT INTO drinks (drink) VALUES (?)", [req.body.drink], function (err, result) {
    //NEED TO BREAK DOWN DRINKS FOR BOOLEAN VALUES
    if (err) throw err;
    res.redirect("/"); //GET REQUEST BACK TO HOME PAGE
  });
});


//UPADTE DRINKS
app.get("/api/:id", function (req, res) {
  connection.query("UPDATE drink SET ? WHERE ?",
    [
      { imbibed: true },
      { id: req.params.id }
    ],
    function (err, res) {
      if (err) throw err;
    }
  );
});


//LISTEN    
app.listen(PORT, function () {
  console.log("Server listening on: http://localhost:" + PORT);
});