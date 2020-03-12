var express = require("express");
var exphbs = require("express-handlebars");
var mysql = require("mysql");

var app = express();

var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

let connection;
if(process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL)
} else {
  connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "burgers_db"
  });
};


connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

app.post("/api/burgers", function (req, res) {
  connection.query("INSERT INTO burgers SET ?",
    [req.body],
    function (err, result) {
      if (err) throw err;
      res.json(result);
    });
    
});

app.get("/", function (req, res) {
  connection.query("SELECT * FROM burgers", function (err, results) {
    if (err) throw err;

    res.render("index", { boigahs: results });
  });
});

app.put("/api/burgers/:id", function (req, res) {
  connection.query("UPDATE burgers SET devoured = true WHERE id = ?", 
  [req.params.id], 
  function (err, result) {
    
    if (err) throw err;
    else if (result.changedRows === 0) {
      return res.status(404).end();
    }
    res.status(200).end();
  });
});


app.listen(PORT, function () {
  console.log("Server listening on: http://localhost:" + PORT);
});