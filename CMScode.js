var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Melito5!",
  database: "cms_db"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

//inital question for user. copying code form class activity 13 
function runSearch() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "Would you like to add, view, update, or exit?",
        choices: [
          "Add",
          "View",
          "Update",
          "Exit"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "Add":
          add();
          break;
  
        case "View":
          view();
          break;
  
        case "Update":
          update();
          break;
  
        case "Exit":
          connection.end();
          break;
        }
      });
  }

function add(){

}

function view(){
    inquirer
    .prompt({
      name: "view",
      type: "list",
      message: "Which of the following would you like to view?",
      choices:["departments","employees","roles"]
    })
    .then(function(answer) {
        var query = "SELECT * from "+answer.view;
        connection.query(query,function (err,res){
            if (err) throw err;
            console.table(res);
        });
        // switch(answer.view){
        //     case "departments":
        //         break;
        //     case "employees":
        //         break;
        //     case "roles":
        //         break;
        // }

    });
}

function update(){

}
